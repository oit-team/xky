module.exports = {
  globals: {
    uni: 'readonly',
    wx: 'readonly',
  },
  overrides: [
    {
      files: [
        'manifest.json',
      ],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/key-spacing': 'off',
        'jsonc/indent': 'off',
      },
    },
  ],
  rules: {
    'vue/component-definition-name-casing': [
      'warn',
      'kebab-case',
    ],
    'vue/component-name-in-template-casing': ['error', 'kebab-case', {
      registeredComponentsOnly: false,
    }],
    'vue/no-deprecated-slot-attribute': 'warn',
    'vue/custom-event-name-casing': 'warn',
    'vue/no-deprecated-v-on-native-modifier': 'warn',
    '@typescript-eslint/no-this-alias': 'warn',
  },
}
