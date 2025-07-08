/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                charcoal: '#262626',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'scale-in-out': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.4)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
            animation: {
                'scale-in-out': 'scale-in-out 0.3s ease-in-out forwards',
            },
            backgroundImage: {
                'home-phones': 'url("@/assets/img/home-phones.png")',
                fbIcon: 'url("@/assets/icons/fbIcon.svg")',
            },
            screens: {
                'md-lg': '875px',
                'lg-lx': '1160px',
                'custom-xl': '1264px',
                'mobile': '767px',
            },
            scale: {
                '10/12': 'calc(10 / 12)',
            },
            padding: {
                'calc-vw': 'calc(100vw - 100%)', // Tạo lớp tùy chỉnh
            },
            width: {
                'calc-medium-width':
                    'calc(100% + 1px - var(--nav-medium-width))',
                'calc-narrow-width':
                    'calc(100% + 1px - var(--nav-narrow-width))',
                'calc-explore-width': 'calc(100% - 40px)',
            },
            transitionProperty: {
                'm-height': 'max-height',
            },
            placeholderColor: {
                'medium-gray': '#989898',
            },
            aspectRatio: {
                '1432/2577': '1432 / 2577',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
}
