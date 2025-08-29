module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    // 关闭格式相关规则
    'prettier/prettier': 'off',
    'indent': 'off',
    'quotes': 'off',
    'semi': 'off',
    'comma-dangle': 'off',
    'no-trailing-spaces': 'off',
    'eol-last': 'off',
    'object-curly-spacing': 'off',
    'array-bracket-spacing': 'off',
    'comma-spacing': 'off',
    'key-spacing': 'off',
    'keyword-spacing': 'off',
    'space-before-blocks': 'off',
    'space-before-function-paren': 'off',
    'space-in-parens': 'off',
    'space-infix-ops': 'off',
    'space-unary-ops': 'off',
    'spaced-comment': 'off',

    // 只保留语法检查规则
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': 'warn', // 未使用变量改为警告
    'vue/multi-word-component-names': 'off'
  }
}
