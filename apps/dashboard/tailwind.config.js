/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#004225',
          light: '#1A5C3A',
          dark: '#002D19',
        },

        background: {
          DEFAULT: '#FFFFFF',
          gray: '#F3F4F6',
          dark: '#1F2937',
        },

        accent: {
          DEFAULT: '#0A66C2',
          dark: '#084A8A',
        },

        success: {
          DEFAULT: '#2ECC71',
          light: '#54D98C',
        },

        error: {
          DEFAULT: '#FF4D4D',
          orange: '#FFA726',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      boxShadow: {
        card: '0 4px 15px rgba(0, 0, 0, 0.08)',
      },

      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
