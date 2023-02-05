module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:tailwindcss/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    plugins: ['tailwindcss', '@typescript-eslint', 'prettier'],
    rules: {
        '@next/next/no-html-link-for-pages': 'off',
        'react/jsx-key': 'off'
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
