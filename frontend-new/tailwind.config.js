/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cyber-black': '#050505',
                'cyber-green': '#00ff41',
                'cyber-dark-green': '#003b00',
            },
            fontFamily: {
                mono: ['"Courier New"', 'monospace'],
            },
        },
    },
    plugins: [],
}
