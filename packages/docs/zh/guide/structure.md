---
layout: doc
title: 项目架构说明
sidebar: true
---

## 目录说明

项目采用 `pnpm` 进行多包管理，整个项目包含以下几个子包：

- components 全局通用的组件库
- docs 前端文档目录
- esbuild-plugin-svg-to-vue3 将 svg 文件转为 vue 组件的插件
- generator 一些代码生成器
- hooks 通用 vue hooks 库
- i18n-tools 用来管理国际化翻译的 web 应用
- icons 应用需要用到的 svg 图标和生成的 vue 代码
- utils 通用工具库
- web 前端主项目

## 项目用到的主要技术栈

- pnpm workspace
- vue3 + vite
- typescript
- tsx
- css 原子化
