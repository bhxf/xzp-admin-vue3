<template>
    <div
        class="full-width flex justify-center items-center"
        style="height: 100vh"
    >
        <q-card
            class="q-pa-sm login"
        >
            <q-card-section class="row justify-center text-h5">
                系统登录
            </q-card-section>
            <q-card-section>
                <q-form ref="loginForm">
                    <q-input
                        v-model="username"
                        :rules="[ val => val && val.length > 0 || '请输入用户名']"
                        standout="bg-blue"
                        @keydown.enter="onLogin"
                    >
                        <template #prepend>
                            <q-icon name="o_account_circle" />
                        </template>
                    </q-input>
                    <q-input
                        v-model="password"
                        :rules="[ val => val && val.length > 0 || '请输入密码']"
                        :type="visibility?'password':'text'"
                        standout="bg-blue"
                        @keydown.enter="onLogin"
                    >
                        <template #prepend>
                            <q-icon name="o_vpn_key" />
                        </template>
                        <template #append>
                            <q-btn
                                flat
                                dense
                                rounded
                                :icon="visibility?'o_visibility':'o_visibility_off'"
                                @click="visibility = !visibility"
                            />
                        </template>
                    </q-input>
                    <q-input
                        v-model="code"
                        :rules="[ val => val && val.length > 0 || '请输入验证码']"
                        standout="bg-blue"
                        @keydown.enter="onLogin"
                    >
                        <template #prepend>
                            <q-icon name="o_qr_code" />
                        </template>
                        <template #after>
                            <div>
                                <q-img
                                    v-if="captcha"
                                    class="bg-grey-3 q-pa-xs rounded-borders"
                                    style="width: 150px;"
                                    :src="captcha?.picPath"
                                    @click="reloadCodeImg"
                                />
                                <q-btn
                                    v-else
                                    flat
                                    dense
                                    rounded
                                    unelevated
                                    icon="refresh"
                                    @click="reloadCodeImg"
                                />
                            </div>
                        </template>
                    </q-input>
                </q-form>
                <q-btn
                    size="lg"
                    color="primary"
                    class="full-width"
                    unelevated
                    @click="onLogin"
                >
                    登录
                </q-btn>
            </q-card-section>
        </q-card>

        <ParticlesComponent
            id="tsparticles"
            :particles-init="particlesInit"
            :particles-loaded="particlesLoaded"
            :options="options"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CaptchaResponse, getCaptcha } from '@/api/system/login';
import { useBaseStore } from '@/store/system/base';
import { ParticlesComponent } from 'particles.vue3';
import { loadFull } from 'tsparticles';

const loginForm = ref<{ validate: any } | null>(null);
const visibility = ref<boolean>(true);
const username = ref<string>('');
const password = ref<string>('');
const code = ref<string>('');
const captcha = ref<CaptchaResponse>();
const options = ref({
    background: {
        color: {
            value: '#0d47a1',
        },
        position: '50% 50%',
        repeat: 'no-repeat',
        size: 'cover',
    },
    fullScreen: {
        zIndex: 1,
    },
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: 'repulse',
            },
            onHover: {
                enable: true,
                mode: 'bubble',
            },
        },
        modes: {
            bubble: {
                distance: 400,
                duration: 0.3,
                opacity: 1,
                size: 4,
                divs: {
                    distance: 200,
                    duration: 0.4,
                    mix: false,
                    selectors: [],
                },
            },
            grab: {
                distance: 400,
                links: {
                    opacity: 0.5,
                },
            },
            repulse: {
                divs: {
                    distance: 200,
                    duration: 0.4,
                    factor: 100,
                    speed: 1,
                    maxSpeed: 50,
                    easing: 'ease-out-quad',
                    selectors: [],
                },
            },
        },
    },
    particles: {
        links: {
            color: {
                value: '#ffffff',
            },
            distance: 500,
            opacity: 0.4,
            width: 2,
        },
        move: {
            attract: {
                rotate: {
                    x: 600,
                    y: 1200,
                },
            },
            direction: 'bottom',
            enable: true,
            outModes: {
                bottom: 'out',
                left: 'out',
                right: 'out',
                top: 'out',
            },
        },
        number: {
            density: {
                enable: true,
            },
            value: 400,
        },
        opacity: {
            random: {
                enable: true,
            },
            value: {
                min: 0.1,
                max: 0.5,
            },
            animation: {
                speed: 1,
                minimumValue: 0.1,
            },
        },
        size: {
            random: {
                enable: true,
            },
            value: {
                min: 1,
                max: 10,
            },
            animation: {
                speed: 40,
                minimumValue: 0.1,
            },
        },
    },
});

const baseStore = useBaseStore();

const reloadCodeImg = async () => {
    captcha.value = await getCaptcha();
};
const onLogin = async () => {
    const success = await loginForm.value?.validate();
    if (success) {
        const data = {
            username: username.value,
            password: password.value,
            captcha: code.value,
            captchaId: captcha.value?.captchaId || '',
        };
        try {
            await baseStore.handlerLogin(data);
        } catch (e) {
            await reloadCodeImg();
        }
    }
};

const particlesInit = async (engine) => {
    await loadFull(engine);
};

const particlesLoaded = async (container) => {
    console.log('Particles container loaded', container);
};
reloadCodeImg();

</script>
<script lang="ts">
export default {
    name: 'Login',
};
</script>

<style scoped lang="sass">
.login
    width: 450px
    z-index: 2
    background: rgb(white,0.4)
.x-form
    ::v-deep(.q-field__bottom)
        padding: 4px 12px 0 !important
</style>
