import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['**/*.{vue,tsx,css}'],
    exclude: ['node_modules', '.git', 'lib']
  },
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        primary: ['Outfit', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif']
      },
      colors: {
        // ui 2.0
        'color-body': 'var(--u-color-body)',
        primary: 'var(--u-primary-color)',
        color1: 'var(--u-color-1)',
        color2: 'var(--u-color-2)',
        color3: 'var(--u-color-3)',
        'color-line': 'var(--u-color-line)',
        'color-border': 'var(--u-color-border)',
        'color-hover': 'var(--u-color-hover)',
        // old
        primary1: 'var(--u-primary-1-color)',
        primary2: 'var(--u-primary-2-color)',
        error: 'var(--u-error-color)',
        success: 'var(--u-success-color)',
        warning: 'var(--u-warning-color)',
        info: 'var(--u-info-color)',
        grey1: 'var(--u-grey-1-color)',
        grey2: 'var(--u-grey-2-color)',
        grey3: 'var(--u-grey-3-color)',
        grey4: 'var(--u-grey-4-color)',
        grey5: 'var(--u-grey-5-color)',
        green1: 'var(--u-green-1-color)',
        purple: 'var(--u-purple-color)',
        'purple-light': 'var(--u-purple-light-color)',
        'purple-gradient': 'var(--u-purple-gradient-color)'
      },
      backgroundImage: {
        'purple-gradient': 'var(--u-purple-gradient-color)'
      }
    }
  },
  shortcuts: {
    // ui 2.0
    'u-h1': 'font-primary font-semibold tracking-normal text-[40px] leading-12',
    'u-h2': 'font-primary font-semibold tracking-normal text-[24px] leading-8',
    'u-h3': 'font-primary font-semibold tracking-normal text-[20px] leading-6',
    'u-h4': 'font-primary font-semibold tracking-normal text-[16px] leading-5',
    'u-h5': 'font-primary font-medium tracking-normal text-[14px] leading-5',
    'u-h6': 'font-primary font-400 tracking-normal text-[14px] leading-5',
    'u-h7': 'font-primary font-400 tracking-normal text-[12px] leading-4',
    'u-num1': 'font-primary font-semibold tracking-normal text-[14px] leading-5',
    'u-num2': 'font-primary font-semibold tracking-normal text-[12px] leading-4',
    // old
    'u-card-title1': 'font-primary font-bold text-[20px] leading-6 tracking-[2px]',
    'u-card-title2': 'font-primary font-bold text-[14px] leading-5 tracking-[2px]',
    'u-title1': 'font-opensans font-semibold tracking-normal text-[20px] leading-6',
    'u-title2': 'font-opensans font-semibold tracking-normal text-[18px] leading-5.5',
    'u-title3': 'font-opensans font-semibold tracking-normal text-[16px] leading-5',
    'u-label1': 'font-opensans font-semibold text-[16px] leading-5 tracking-[2px]',
    'u-label2': 'font-opensans font-bold text-[14px] leading-5 tracking-[2px]',
    'u-header1': 'font-opensans font-bold text-[14px] leading-5 tracking-[0.6px]',
    'u-body1': 'font-opensans font-normal tracking-normal text-[16px] leading-5',
    'u-body2': 'font-opensans font-normal tracking-normal text-[14px] leading-5',
    'u-body3': 'font-opensans font-bold tracking-normal text-[16px] leading-5 italic',
    'u-body3-pure': 'font-opensans font-bold tracking-normal text-[16px] leading-5 italic',
    'u-body4': 'font-opensans font-semibold tracking-normal text-[14px] leading-5',
    'u-body5': 'font-opensans font-bold tracking-normal text-[12px] leading-0.875rem italic',
    'u-caption': 'font-opensans font-normal tracking-normal text-[14px] leading-5',
    'u-tag': 'font-opensans font-normal tracking-normal text-[12px] leading-4',
    'u-tag2': 'font-opensans font-semibold tracking-normal text-[12px] leading-4'
  },
  extend: {
    lineClamp: {
      sm: '3',
      lg: '10'
    }
  },
  plugins: [require('windicss/plugin/line-clamp'), require('windicss/plugin/aspect-ratio')]
})
