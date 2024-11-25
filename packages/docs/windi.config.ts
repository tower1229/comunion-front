import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['**/*.{vue,tsx,css,md}'],
    exclude: ['node_modules', '.git', 'lib']
  },
  darkMode: 'class',
  theme: {
    extend: {
      // fontFamily: {
      //   orbitron: ['Orbitron', 'sans-serif'],
      //   opensans: ['Open Sans', 'sans-serif']
      // },
      colors: {
        primary: 'var(--u-primary-color)',
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
        purple: 'var(--u-purple-color)',
        'purple-light': 'var(--u-purple-light-color)',
        'purple-gradient': 'var(--u-purple-gradient-color)'
      }
    }
  }
})
