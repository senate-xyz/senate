module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:tailwindcss/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
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
            './../../apps/bulletin/tsconfig.json',
            './../../apps/detective/tsconfig.json',
            './../../apps/refresher/tsconfig.json',
            './../../apps/senate/tsconfig.json'
        ]
    }
}
