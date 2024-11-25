import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import WindiCSS from 'vite-plugin-windicss'
import { layoutGroupedRoutes } from './src/routes'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: process.env.PORT ? +process.env.PORT : 9002
  },
  define: {
    'process.env.NODE_DEBUG': false
  },
  // optimizeDeps: {
  //   include: ['bn.js', 'hash.js']
  // },
  plugins: [
    vue(),
    vueJsx({
      // enableObjectSlots: true
    }),
    WindiCSS(),
    Pages({
      extensions: ['tsx'],
      pagesDir: 'src/pages',
      exclude: ['**/components/**/*.*', '**/blocks/**/*.*', '**/hooks/**/*.*', '**/_*.*'],
      importMode: 'async',
      routeStyle: 'next',
      // nuxtStyle: true,
      extendRoute(route) {
        function addLayout(layout: string) {
          route.meta = route.meta || {}
          route.meta.layout = layout
        }

        for (const layout of Object.keys(layoutGroupedRoutes)) {
          const routes = layoutGroupedRoutes[layout] as string[]
          for (const rule of routes) {
            if (rule.includes('*')) {
              if (route.path.match(new RegExp('^' + rule.replace('*', '\\S*')))) {
                addLayout(layout)
                break
              }
            } else {
              if (route.path === rule) {
                addLayout(layout)
                break
              }
            }
          }
          if (!route.meta?.layout) {
            addLayout('default/index')
          }
        }
        return route
      }
    }),
    Layouts({
      extensions: ['tsx']
    })
  ]
})
