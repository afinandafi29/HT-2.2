import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
<<<<<<< HEAD
  {
    ignores: [
      'dist',
      '*.config.js',
      'download_drive_images.js',
      'extract_pinterest.js',
      'generate_drive_avatars.js',
      'update_images.py',
      'branding_fix.py',
      'add_space.py'
    ]
  },
=======
  { ignores: ['dist'] },
>>>>>>> 7257dc869ef60e2fe2df31eb77999c361539cb5b
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
<<<<<<< HEAD
      globals: {
        ...globals.browser,
        process: 'readonly',
        require: 'readonly'
      },
=======
      globals: globals.browser,
>>>>>>> 7257dc869ef60e2fe2df31eb77999c361539cb5b
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
<<<<<<< HEAD
      'no-unused-vars': ['warn', {
        varsIgnorePattern: '^_|^[A-Z_]',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
=======
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
>>>>>>> 7257dc869ef60e2fe2df31eb77999c361539cb5b
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
