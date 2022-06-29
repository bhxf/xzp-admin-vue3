import {
    Dialog, Loading, Notify,
} from 'quasar';
import { BaseFunction } from '@/components';

export const notify = {
    success: (message: string) => {
        Notify.create({
            message,
            position: 'top',
            icon: 'check_circle',
            color: 'positive',
            textColor: 'white',
            actions: [{ icon: 'close', color: 'white' }],
        });
    },
    error: (message: string) => {
        Notify.create({
            message,
            position: 'top',
            icon: 'error',
            color: 'deep-orange-6',
            textColor: 'white',
            actions: [{ icon: 'close', color: 'white' }],
        });
    },
    loading: (message: string) => Notify.create({
        group: false,
        timeout: 0,
        spinner: true,
        color: 'primary',
        message,
        position: 'top',
    }),
    done: (oldNotify:BaseFunction, message:string) => {
        oldNotify({
            icon: 'done',
            spinner: false,
            message,
            timeout: 1000,
            position: 'top',
        });
    },
};
export const loading = {
    base: (message: string) => {
        Loading.show({
            boxClass: 'bg-grey-2 text-grey-9',
            message,
            spinnerColor: 'primary',
        });
    },
    hide: () => {
        Loading.hide();
    },
};
export const dialog = {
    confirm: (title: string, message: string, ok:()=>void, cancel:()=>void) => {
        Dialog.create({
            title,
            message,
            color: 'primary',
            ok: true,
            cancel: true,
        }).onOk(ok).onCancel(cancel);
    },
};
