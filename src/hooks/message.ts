import {Dialog, Loading, Notify} from 'quasar'

export const notify = {
    success: (message: string) => {
        Notify.create({
            message,
            position: 'top-right',
            icon: 'check_circle',
            color: 'positive',
            textColor: 'white',
            actions: [{icon: 'close', color: 'white'}]
        })
    },
    error: (message: string) => {
        Notify.create({
            message,
            position: 'top-right',
            icon: 'error',
            color: 'deep-orange-6',
            textColor: 'white',
            actions: [{icon: 'close', color: 'white'}]
        })
    },
    loading: (message: string) => {
        Notify.create({
            spinner: true,
            message,
        })
    }
}
export const loading = {
    base: (message: string) => {
        Loading.show({
            message,
            spinnerColor: 'primary',
        })
    },
    hide: () => {
        Loading.hide()
    }
}
export const dialog = {
    confirm: (title: string, message: string, ok:()=>void, cancel:()=>void) => {
        Dialog.create({
            title,
            message,
            color:'primary',
            ok:true,
            cancel:true,
        }).onOk(ok).onCancel(cancel)
    }
}
