import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import polyfillNode from 'rollup-plugin-polyfill-node'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import WindiCSS from 'vite-plugin-windicss'
import { layoutGroupedRoutes, morePath } from './src/routes'
// import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@walletconnect/web3-provider': path.resolve(
        __dirname,
        './node_modules/@walletconnect/web3-provider/dist/umd/index.min.js'
      )
    }
  },
  server: {
    port: process.env.PORT ? +process.env.PORT : 9001,
    proxy: {
      '/api': 'https://d.welaunch.work'
    }
  },
  optimizeDeps: {
    // 👈 optimizedeps
    esbuildOptions: {
      target: 'esnext',
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      supported: {
        bigint: true
      }
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: tag => tag.includes('-')
        }
      }
    }),
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
      },
      onRoutesGenerated(routes) {
        const morePathKey = Object.keys(morePath)
        let temp_routes = routes
        morePathKey.forEach(item => {
          let route: { path: string; name: string } | undefined = undefined
          route = temp_routes.find(gra => gra.path === item)
          if (route) {
            route = JSON.parse(JSON.stringify(route))
            route!.path = morePath[item].path
            route!.name = morePath[item].name
            temp_routes = [...temp_routes, route]
          }
        })
        return temp_routes
      }
    }),
    Layouts({
      extensions: ['tsx']
    })
    // polyfillNode()
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        // manualChunks: {
        //   wallet: ['@walletconnect/web3-provider'],
        //   ethers: ['ethers'],
        //   vue: ['vue', 'vue-router', 'pinia'],
        //   tools: ['axios', 'buffer', 'events', 'util']
        // }
        manualChunks(id) {
          const chunkMap = {
            ethers: 'ethers',
            vue: 'vue',
            'vue-router': 'vue',
            pinia: 'tools',
            'naive-ui': 'ui',
            axios: 'tools',
            buffer: 'tools',
            events: 'tools',
            vuedraggable: 'vuedraggable',
            '@sentry/vue': 'sentry',
            '@sentry/tracing': 'sentry',
            '@vueuse/core': 'vue',
            '@wagmi/core': 'wallet',
            '@web3modal/html': 'wallet',
            '@web3modal/ethereum': 'wallet',
            viem: 'wallet'
          }
          const splited = id.split('node_modules')
          if (splited.length > 1) {
            let pkgName
            let pkgPath = splited[splited.length - 1]
            if (pkgPath.startsWith('/') || pkgPath.startsWith('\\')) {
              pkgPath = pkgPath.substring(1)
            }
            if (pkgPath.startsWith('@')) {
              pkgName = pkgPath.split('/').slice(0, 2).join('/')
            } else {
              pkgName = pkgPath.split('/')[0]
            }
            if (
              Object.keys(chunkMap).includes(pkgName) ||
              (pkgName.startsWith('@') &&
                Object.keys(chunkMap).find(key => pkgName.startsWith(key)))
            ) {
              return chunkMap[pkgName]
            }
            return 'bundle'
          }
        }
      }
    }
  }
})
