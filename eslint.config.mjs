import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['eslint.config.mjs', 'node_modules', 'dist', 'public'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            ecmaVersion: 5,
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            "@typescript-eslint/require-await": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            indent: ['error', 4, {
                ignoredNodes: ['PropertyDefinition[decorators.length>0]'],
            },],
            'prettier/prettier': [
                'error',
                { tabWidth: 4, useTabs: false, endOfLine: 'lf' },
            ],
        },
    },
);
