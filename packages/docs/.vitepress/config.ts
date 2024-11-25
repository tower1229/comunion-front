import vueJsx from '@vitejs/plugin-vue-jsx'
import { DemoComponentPlugin } from './plugin/index'
import windicssPlugin from 'vite-plugin-windicss'

import type { UserConfig } from 'vitepress/types/index'

const config: UserConfig = {
  base: process.env.NODE_ENV === 'development' ? '/' : '/comunion-front/',
  lang: 'en-US',
  title: 'Comunion Frontend Developer',
  description: 'Comunion frontend developer documents',
  lastUpdated: true,
  locales: {
    '/': {
      lang: 'en-US'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Comunion 前端开发者中心',
      description: 'Comunion 前端开发者文档中心'
    }
  },
  themeConfig: {
    // logo: 'logo.png',
    editLink: {
      pattern: 'https://github.com/comunion-io/comunion-front/edit/develop/packages/docs/:path'
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/comunion-io/comunion-front' }],
    lastUpdatedText: 'Last Updated',
    locales: {
      '/': {
        selectText: 'Languages',
        label: 'English',
        ariaLabel: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        serviceWorker: {
          updatePopup: {
            message: 'New content is available.',
            buttonText: 'Refresh'
          }
        }
        // algolia: {},
        // nav: [
        //   { text: 'Nested', link: '/nested/', ariaLabel: 'Nested' }
        // ],
        // sidebar: {
        //   '/': [/* ... */],
        //   '/nested/': [/* ... */]
        // }
      },
      '/zh/': {
        selectText: '选择语言',
        label: '简体中文',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '更新于',
        serviceWorker: {
          updatePopup: {
            message: '发现新内容可用.',
            buttonText: '刷新'
          }
        },
        nav: [
          { text: '开发入门', link: '/zh/guide/getting-started', activeMatch: '^/zh/guide' },
          { text: '组件库', link: '/zh/components/', activeMatch: '^/zh/components' },
          { text: '函数库', link: '/zh/libraries/hooks/useUser', activeMatch: '^/zh/libraries' }
        ],
        sidebar: {
          '/zh/guide/': [
            {
              text: '开发入门',
              items: [
                { text: '快速开始', link: '/zh/guide/getting-started' },
                { text: '编辑器配置', link: '/zh/guide/ide' },
                { text: '代码结构', link: '/zh/guide/structure' },
                { text: '开发规范', link: '/zh/guide/specification' },
                { text: '组件设计规范', link: '/zh/guide/component' },
                { text: '开发约定', link: '/zh/guide/agreement' },
                { text: 'Git 规范', link: '/zh/guide/git' },
                { text: '上链交互', link: '/zh/guide/chain' },
                { text: '开发规划', link: '/zh/guide/roadmap' }
              ]
            }
          ],
          '/zh/components/': [
            {
              text: '组件库',
              items: [
                {
                  text: '基础',
                  items: [
                    { text: '排版', link: '/zh/components/typography' },
                    { text: '图标', link: '/zh/components/icons' },
                    { text: '按钮', link: '/zh/components/button' }
                  ]
                },
                {
                  text: '表单',
                  items: [{ text: '输入框', link: '/zh/components/input' }]
                },
                {
                  text: '显示',
                  items: [
                    { text: 'tag', link: '/zh/components/tag' },
                    { text: '开发中', link: '/zh/components/developing' },
                    { text: 'star', link: '/zh/components/star' }
                  ]
                },
                {
                  text: '导航',
                  items: [
                    { text: '返回', link: '/zh/components/back' },
                    { text: '查看更多', link: '/zh/components/viewMore' }
                  ]
                }
              ]
            }
          ],
          '/zh/libraries/': [
            {
              text: '函数库',
              items: [
                {
                  text: 'hooks',
                  items: [{ text: '用户', link: '/zh/libraries/hooks/useUser' }]
                },
                {
                  text: '函数库',
                  items: [{ text: '链', link: '/zh/libraries/utils/chain' }]
                }
              ]
            }
          ]
        }
        // algolia: {
        //   apiKey: '',
        //   indexName: 'comunion-fe'
        // },
      }
    },

    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2021-present Comunion'
    }
    // algolia: {
    //   apiKey: 'c57105e511faa5558547599f120ceeba',
    //   indexName: 'vitepress'
    // },
  },
  markdown: {
    config: md => {
      md.use(require('markdown-it-task-lists'))
      md.use(DemoComponentPlugin)
      // md.use(HelloComponentPlugin)
    }
  },
  vite: {
    server: {
      fs: {
        // 可以为项目根目录的上一级提供服务
        allow: ['..']
      }
    },
    plugins: [
      vueJsx({
        enableObjectSlots: true
      }),
      windicssPlugin()
    ]
  }
}

export default config
