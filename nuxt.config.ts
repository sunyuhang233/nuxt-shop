// https://nuxt.com/docs/api/configuration/nuxt-config
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    '@ant-design-vue/nuxt',
    '@vant/nuxt',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    'dayjs-nuxt',
  ],

  app: {
    pageTransition: {name: 'fade-slide-y', mode: 'out-in'},
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      charset: 'utf-8',
      link:[
        {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
      ],
      /*script: [
        {src: 'https://assets.salesmartly.com/js/project_186434_192649_1733291064.js'}
      ]*/
    }
  },

  routeRules: {
    // Redirects legacy urls
    '/user': { redirect: '/user/orders' }
  },

  antd:{
    // Options
    extractStyle: true
  },

  vant: {
    /** Options */
    lazyload: true
  },

  dayjs: {
    locales: ['zh-cn'],
    defaultLocale: 'zh-cn',
    plugins: [
      'relativeTime' // 需要的插件
    ]
  },

  build: {
    transpile:
        process.env.NODE_ENV === 'production'
            ? [
              'naive-ui',
              'vueuc',
              '@css-render/vue3-ssr',
              '@juggle/resize-observer'
            ]
            : ['@juggle/resize-observer']
  },

  css: [
    '/assets/_global.less'
  ],

  vite: {
    optimizeDeps: {
      include:
          process.env.NODE_ENV === 'development'
              ? ['naive-ui', 'vueuc']
              : []
    },
    plugins: [
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar'
            ]
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ],
  },

  compatibilityDate: '2024-12-02'
})