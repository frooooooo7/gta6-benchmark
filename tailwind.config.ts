import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#090A0F',
          pure: '#000000',
        },
        surface: {
          DEFAULT: '#11131D',
          elevated: '#181B29',
          hover: '#1F2335',
          active: '#262B40',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          medium: 'rgba(255, 255, 255, 0.14)',
          focus: 'rgba(0, 229, 195, 0.4)',
        },
        content: {
          primary: '#F4F6FB',
          secondary: '#949AB1',
          muted: '#646A80',
          inverted: '#090A0F',
        },
        accent: {
          teal: {
            DEFAULT: '#00E5C3',
            subtle: 'rgba(0, 229, 195, 0.12)',
            hover: '#00CCAE',
          },
          amber: {
            DEFAULT: '#FF9E44',
            subtle: 'rgba(255, 158, 68, 0.12)',
            hover: '#F08E35',
          },
          coral: {
            DEFAULT: '#FF4D8D',
            subtle: 'rgba(255, 77, 141, 0.12)',
            hover: '#E83D7C',
          },
          cyan: {
            DEFAULT: '#38BDF8',
            subtle: 'rgba(56, 189, 248, 0.12)',
            hover: '#0EA5E9',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-plus-jakarta)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      transitionTimingFunction: {
        leonida: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        fast: '160ms',
        normal: '200ms',
      },
      boxShadow: {
        'surface-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'glow-teal': '0 0 24px -4px rgba(0, 229, 195, 0.25)',
        'glow-amber': '0 0 24px -4px rgba(255, 158, 68, 0.25)',
        'glow-coral': '0 0 24px -4px rgba(255, 77, 141, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
