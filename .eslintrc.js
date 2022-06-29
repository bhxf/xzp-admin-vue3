module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ['@', './src'],
                ],
                extensions: ['.ts', '.js', '.jsx', '.json'],
            },
        },
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: [
        'vue',
        '@typescript-eslint',
    ],
    rules: {
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        indent: ['error', 4],
        'vue/html-indent': ['error', 4],
        'vue/script-indent': ['error', 4],
        'max-len': ['error', 300],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'vue/no-reserved-component-names': ['error', {
            disallowVueBuiltInComponents: false,
            disallowVue3BuiltInComponents: false,
        }],
        'no-param-reassign': ['error', { props: false }],
        'vue/multi-word-component-names': ['error', {
            ignores: ['Dashboard', 'Menu', 'Login', 'Role', 'Api', 'Dictionary', 'Template'],
        }],
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off',
            },
        },
    ],

};
