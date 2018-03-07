// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'semi': ['error', 'always'],
    'indent': 0,
    "no-underscore-dangle": "off",
    "arrow-body-style": "off",
    "no-param-reassign": [
      "error",
      {
        "props": false
      }
    ],
    "max-len": [
      "error",
      140
    ],
    "consistent-return": "off",
    "padded-blocks": "off",
    "new-cap": "off",
    "jsx-a11y/no-static-element-interactions": 0,
  }
}
