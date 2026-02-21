//optionnel en v4 mais utile si besoin d'étendre le theme

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // React + TSX
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}