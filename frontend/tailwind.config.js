/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                clay: {
                    bg: '#f0f4f8',
                    card: '#ffffff',
                    text: '#2d3748',
                    subtext: '#718096',
                    accent: '#6366f1',
                    secondary: '#ec4899',
                },
                neuro: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                accent: {
                    green: '#10b981',
                    amber: '#f59e0b',
                    red: '#ef4444',
                    purple: '#8b5cf6',
                    pink: '#ec4899',
                },
            },
            fontFamily: {
                sans: ['"Outfit"', 'sans-serif'],
                display: ['"Clash Display"', 'sans-serif'],
            },
            boxShadow: {
                'clay-card': '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
                'clay-button': '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
                'clay-button-active': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
                'clay-input': 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff',
                'clay-float': '12px 12px 24px #cbd5e1, -12px -12px 24px #ffffff',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'bounce-slow': 'bounce 3s infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pop: {
                    '0%': { opacity: '0', transform: 'scale(0.8)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
};
