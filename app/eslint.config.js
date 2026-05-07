// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      'import/no-unresolved': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@bombom/shared/ui-web', '@bombom/shared/ui-web/*'],
              message: '@bombom/shared/ui-web은 웹 전용 패키지입니다.',
            },
          ],
        },
      ],
    },
  },
]);
