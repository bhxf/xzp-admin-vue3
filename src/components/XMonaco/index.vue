<template>
    <div
        ref="dom"
        class="editor"
    />
</template>

<script setup lang="ts">
import {
    defineProps, defineEmits, ref, nextTick, watch, onBeforeUnmount, toRaw,
} from 'vue';

// eslint-disable-next-line import/no-unresolved
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// eslint-disable-next-line import/no-unresolved
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// eslint-disable-next-line import/no-unresolved
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
// eslint-disable-next-line import/no-unresolved
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
// eslint-disable-next-line import/no-unresolved
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import * as monaco from 'monaco-editor';
import { useQuasar } from 'quasar';

// @ts-ignore
// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
    getWorker(_: string, label: string) {
        if (label === 'json') {
            // eslint-disable-next-line new-cap
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            // eslint-disable-next-line new-cap
            return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            // eslint-disable-next-line new-cap
            return new htmlWorker();
        }
        if (['typescript', 'javascript'].includes(label)) {
            // eslint-disable-next-line new-cap
            return new tsWorker();
        }
        return new EditorWorker();
    },
};

const props = withDefaults(
    defineProps<{
        modelValue: string,
        modelType: string,
        options?:monaco.editor.IStandaloneEditorConstructionOptions
    }>(),
    {
        modelValue: '',
        modelType: 'json',
        options: {
            automaticLayout: true,
            scrollBeyondLastLine: false,
            minimap: {
                enabled: false,
            },
        },
    },
);

const $q = useQuasar();
const emit = defineEmits(['update:modelValue']);

const dom = ref<any>(null);
const editor = ref<monaco.editor.IStandaloneCodeEditor>();

const setModel = (val:string, type:string) => {
    const model = monaco.editor.createModel(val, type);
    toRaw(editor.value)?.setModel(model);
};
const initMonaco = async () => {
    await nextTick();
    editor.value = monaco.editor.create(dom.value, { ...props.options });
    toRaw(editor.value)?.onDidChangeModelContent(() => {
        const codeValue = toRaw(editor.value)?.getValue();
        emit('update:modelValue', codeValue);
    });
    toRaw(editor.value)?.getAction('editor.action.formatDocument').run();
};

watch(() => $q.dark.isActive, (val) => {
    monaco.editor.setTheme(val ? 'vs-dark' : 'vs-light');
}, { immediate: true });

initMonaco();

onBeforeUnmount(() => {
    toRaw(editor.value)?.dispose();
});

defineExpose({ setModel });
</script>
<script lang="ts">
export default {
    name: 'XMonaco',
};
</script>

<style scoped>
  .editor {
    height: 100%;
  }
</style>
