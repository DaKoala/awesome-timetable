module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        '@vue/airbnb',
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: ['error', 4],
        'no-param-reassign': 'off',
        'space-before-function-paren': 'off',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
