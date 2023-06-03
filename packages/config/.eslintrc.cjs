module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:tailwindcss/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:@next/next/recommended'
    ],
    plugins: [
        'tailwindcss',
        '@typescript-eslint',
        'prettier',
        'unused-imports'
    ],
    rules: {
        '@next/next/no-html-link-for-pages': 'off',
        'react/jsx-key': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'error',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_'
            }
        ]
    },
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
            './../axiom/tsconfig.json',
            './../database/tsconfig.json',
            './../../apps/senate/tsconfig.json',
            './../../apps/shortie/tsconfig.json',
            './../../utilities/stressTest/tsconfig.json',
            './../../utilities/userMigration/tsconfig.json'
        ]
    }
}
