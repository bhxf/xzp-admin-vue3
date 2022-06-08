<template>
    <div class="full-width flex justify-center items-center" style="height: 100vh">
        <q-card style="width: 450px;" class="q-pa-sm">
            <q-card-section class="row justify-center text-h5">系统登录</q-card-section>
            <q-card-section>
                <q-form ref="loginForm">
                    <q-input
                        @keydown.enter="onLogin"
                        :rules="[ val => val && val.length > 0 || '请输入用户名']"
                        standout
                        v-model="username">
                        <template #prepend>
                            <q-icon name="o_account_circle"/>
                        </template>
                    </q-input>
                    <q-input
                        @keydown.enter="onLogin"
                        :rules="[ val => val && val.length > 0 || '请输入密码']"
                        :type="visibility?'password':'text'" standout
                        v-model="password">
                        <template #prepend>
                            <q-icon name="o_vpn_key"/>
                        </template>
                        <template #append>
                            <q-btn @click="visibility = !visibility" flat dense rounded
                                   :icon="visibility?'o_visibility':'o_visibility_off'"/>
                        </template>
                    </q-input>
                    <q-input
                        @keydown.enter="onLogin"
                        :rules="[ val => val && val.length > 0 || '请输入验证码']"
                        standout
                        v-model="code"
                    >
                        <template #prepend>
                            <q-icon name="o_qr_code"/>
                        </template>
                        <template #after>
                            <div>
                                <q-img class="bg-grey-3 q-pa-xs rounded-borders" style="width: 150px;" v-if="captcha"
                                       @click="reloadCodeImg" :src="captcha?.picPath"/>
                                <q-btn v-else flat dense rounded icon="refresh" @click="reloadCodeImg"/>
                            </div>
                        </template>
                    </q-input>
                </q-form>
                <q-btn @click="onLogin" size="lg" color="primary" class="full-width">登录</q-btn>

            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {CaptchaResponse, getCaptcha, login} from "@/api/system/login";
import {useBaseStore} from "@/store/system/base";
import {Loading, QSpinnerGears} from "quasar";

const loginForm = ref<{ validate: any } | null>(null)
const visibility = ref<boolean>(true)
const username = ref<string>('')
const password = ref<string>('')
const code = ref<string>('')
const captcha = ref<CaptchaResponse>()

const baseStore = useBaseStore()

const reloadCodeImg = async () => {
    captcha.value = await getCaptcha()
}
const onLogin = async () => {
    const success = await loginForm.value?.validate()
    if (success) {
        const data = {
            username: username.value,
            password: password.value,
            captcha: code.value,
            captchaId: captcha.value?.captchaId || ''
        }
        try {
            await baseStore.handlerLogin(data)
        }catch (e){
            await reloadCodeImg()
        }
    }
}

reloadCodeImg()

</script>
<script lang="ts">
export default {
    name: "Login",
};
</script>

<style scoped lang="less">
</style>
