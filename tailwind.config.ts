// tailwind.config.js (or .ts if you're using TypeScript for config)
import defaultTheme from 'tailwindcss/defaultTheme'; // Import default theme

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        colors: {
            ...defaultTheme.colors,

            language: {
                js: '#f1e05a',
                ts: '#2b7489',
                java: '#b07219',
                py: '#3572A5',
                csharp: '#178600',
                php: '#4F5D95',
                html: '#e34c26',
                css: '#563d7c',
                ruby: '#701516',
                go: '#00ADD8',
                swift: '#fdab3e',
                kotlin: '#A97BFF',
                rust: '#dea584',
                scala: '#c22d40',
                perl: '#0298c3',
                hcl: '#844FBA',
                shell: '#89e051',
                dart: '#00B4AB',
                lua: '#000080',
                r: '#198CE7',
            },
        },
    },
    plugins: [
        // Your Tailwind v4 plugins go here
    ],
};