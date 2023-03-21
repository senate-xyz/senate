/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Matter', { fontFeatureSettings: '"salt", "ss01"' }],
                mono: ['DM Mono']
            }
        }
    },
    plugins: []
}
