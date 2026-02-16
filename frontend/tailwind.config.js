/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                neuro: {
                    50: '#f0f4ff',
                    100: '#dbe4ff',
                    200: '#bac8ff',
                    300: '#91a7ff',
                    400: '#748ffc',
                    500: '#5c7cfa',
                    600: '#4c6ef5',
                    700: '#4263eb',
                    800: '#3b5bdb',
                    900: '#364fc7',
                },
                accent: {
                    green: '#10B981',
                    red: '#EF4444',
                    amber: '#F59E0B',
                    purple: '#8B5CF6',
                },
                dark: {
                    900: '#0a0e1a',
                    800: '#111827',
                    700: '#1a2035',
                    600: '#232b3e',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(92, 124, 250, 0.3)' },
                    '100%': { boxShadow: '0 0 20px rgba(92, 124, 250, 0.6)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
};
