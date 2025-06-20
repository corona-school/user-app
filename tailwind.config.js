const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: ['./src/**/*.{ts,tsx}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        fontSize: {
            '4xl': '3.06rem',
            '3xl': '2.4375rem',
            '2xl': '1.953125rem',
            xl: '1.5625rem',
            lg: '1.25rem',
            base: '1rem',
            sm: '0.8rem',
            xs: '0.64rem',
        },
        lineHeight: {
            10: '3.38rem',
            9: '2.8125rem',
            8: '2.34375rem',
            7: '2rem',
            6: '1.75rem',
            5: '1.625rem',
            4: '1.5rem',
            3: '1.35rem',
            2: '1.25rem',
            1: '0.875rem',
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
                    light: 'hsl(var(--primary-light))',
                    lighter: 'hsl(var(--primary-lighter))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    lighter: 'hsl(var(--destructive-lighter))',
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
                    DEFAULT: 'hsl(var(--background))',
                    foreground: 'hsl(var(--foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            borderRadius: {
                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: 'calc(var(--radius) - 4px)',
            },
            fontFamily: {
                sans: ['var(--font-sans)', ...fontFamily.sans],
            },
            letterSpacing: {
                tightest: '-0.005rem',
                tighter: '-0.0075rem',
                tight: '-0.012rem',
            },
            fontSize: {
                detail: '0.875rem',
                form: ['0.875rem', { lineHeight: '0.875rem', letterSpacing: '0', fontWeight: '500' }],
            },
            lineHeight: {
                'leading-3': '0.875rem',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'shine': {
                    '0%': { transform: 'translateY(0)', opacity: '0' },
                    '10%': { opacity: '1' },
                    '100%': { transform: 'translateY(-200px)', opacity: '0' },
                },
                'bell-ring': {
                    '0%': { transform: 'scaleX(1)' },
                    '10%, 5%': { transform: 'scale3d(.9,.9,.9) rotate(-5deg)' },
                    '15%, 25%, 35%, 45%': { transform: 'scale3d(1.1,1.1,1.1) rotate(5deg)' },
                    '20%, 30%, 40%': { transform: 'scale3d(1.1,1.1,1.1) rotate(-5deg)' },
                    '50%': { transform: 'scale3d(1.1,1.1,1.1) rotate(-5deg)' },
                },
                'skeleton': {
                    '0%': { backgroundColor: '#222222' },
                    '100%': { backgroundColor: '#2A2A2A' }, 
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'shine': 'shine 2s infinite',
                'bell-ring': 'bell-ring 2s infinite',
                'skeleton': 'skeleton 1s infinite',
            },
            boxShadow: {
                bottomNavigation: '0px 4px 16px rgba(17,17,26,0.1), 0px 8px 24px rgba(17,17,26,0.1),0px 16px 56px rgba(17,17,26,0.1)',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
