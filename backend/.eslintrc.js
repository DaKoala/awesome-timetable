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
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'indent': ['error', 4],
        'no-trailing-spaces': 'off',
        'space-before-function-paren': 'off',
        'prefer-destructuring': 'off',
        'no-underscore-dangle': 'off',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
