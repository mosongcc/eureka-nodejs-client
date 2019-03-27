/**
 * 官网配置Rules文档  https://eslint.org/docs/rules/
 */
module.exports = {
    root: true,
    extends: [
        //默认配置模板
        'eslint:recommended'
    ],
    env: {
        // 这个设置会同时自动启用 ES6 语法支持
        'es6': true
    },
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        // 禁用未声明的变量
        'no-undef': 'off',
        // 禁止在语句末尾使用分号
        'semi': ['error', 'never'],
        // 强制在逗号后使用空格
        'comma-spacing': ['error', {
            "before": false,
            "after": true
        }],
        // 限定单引号字符串
        'quotes': ['error', 'single'],
        // 限定代码缩进4个空格
        'indent': ['error', 4],
        // 强制使用 Unix 换行符： \n
        'linebreak-style': ['error', 'unix'],
        // 允许使用console
        'no-console': 'off'
    },
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
        ecmaVersion: 8
    }
}