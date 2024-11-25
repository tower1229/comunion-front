// windi.config.js
import ComponentConfig from '@comunion/components/windi.config'
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  ...ComponentConfig,
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx}', 'public/**/*.html', 'index.html'],
    exclude: ['node_modules', '.git']
  },
  theme: {
    ...ComponentConfig.theme,
    extend: {
      // @ts-ignore
      ...ComponentConfig.theme.extend
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      1366: '1366px',
      '2xl': '1536px'
    }
  },
  shortcuts: {
    ...ComponentConfig.shortcuts,
    'u-page-container': 'mx-auto w-full max-w-270 <lg:px-4'
  }
})
