import {defineStore} from 'pinia'
import {login, LoginRequest, User} from "@/api/system/login";
import {useNavTabStore} from "@/store/settings/navigation";
import {useRouter} from "@/plugins/router";
import {settingsEnum} from "@/tools/http";
import {loading, notify} from "@/hooks/message";
import {getSysDictionaryDetailAllList} from "@/api/system/dictionary";

interface BaseStore {
    user: User | null,
    token: string | null,
}

function getUser() {
    const user = sessionStorage.getItem(settingsEnum.USER)
    return user && JSON.parse(user)
}

export const useBaseStore = defineStore('baseStore', {
    state: (): BaseStore => {
        return <BaseStore>{
            user: getUser(),
            token: ''
        }
    },
    getters: {
    },
    actions: {
        clearUser() {
            this.user = null
            this.token = null
            sessionStorage.clear()
        },
        async handlerLogin(data: LoginRequest) {

            loading.base('正在登录系统，请稍等...')

            try {
                const result = await login(data)
                this.user = result.user
                this.token = result.token
                sessionStorage.setItem(settingsEnum.TOKEN,result.token)
                sessionStorage.setItem(settingsEnum.USER,JSON.stringify(result.user))
                //获取字典
                const result2 = await getSysDictionaryDetailAllList()
                sessionStorage.setItem(settingsEnum.DICTIONARY,JSON.stringify(result2.list))

                const navStore = useNavTabStore()
                navStore.currentNavTab = {
                    ID: '1',
                    name: 'dashboard',
                    path: 'dashboard',
                    meta:{title:'首页',icon:'o_other_houses',closeTab:false},
                }

                notify.success(`欢迎${this.user?.userName}回来`)
            }catch (e) {
                throw e
            }finally {
                loading.hide()
            }


        },
        async handlerLogout() {
            const router = useRouter
            await router.push({path: 'login'})
            notify.success(`${this.user?.userName}已退出系统`)
            this.clearUser()
        }
    }
})
