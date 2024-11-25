---
layout: doc
title: 快速开始
sidebar: true
---

跟着下面的教程开始一个新页面的开发吧：

## 项目启动

初始化项目及启动开发服务

```bash
git clone https://github.com/comunion-io/comunion-front
cd comunion-front
pnpm install
pnpm dev
```

- 启动文档预览
  ```bash
  pnpm run docs
  ```
- 子包监听
  ```bash
  pnpm run dev:utils
  pnpm run dev:components
  pnpm run dev:hooks
  ```

## 如何添加页面

进入 `packages/web` 目录下，在 `src/pages` 目录下新建一个 `hello.tsx` 文件，输入 `v3p` 然后根据 `vscode` 提示新建一个页面，`name` 字段就填 `HelloPage`，内容就先输入 `<div>Hello Comunion</div>`，保存后就可以通过 `/hello` 路由查看页面了。[（关于更多路由配置请查看 vite-plugin-pages）](https://github.com/hannoeru/vite-plugin-pages)

## 如何添加一个组件

写页面离不开组件封装，如果要添加一个全局组件，请到根目录下执行 `pnpm gen:component` 名称生成一个组件模板。
如果是要添加一个 `web` 项目的组件，那么就在 `web` 项目的 `components` 目录新建一个组件名称的文件夹以及入口文件。
如果只是要添加当前页面的特定组件，那么就在页面目录下新建一个 `components` 目录然后在目录里添加入口文件。
入口文件可以用 `v3c` 这个 `snippet` 进行快速生成

## 如何书写样式

组件和页面的样式如何书写呢？一般情况下页面直接调用各类组件就可以完成开发，但少不了有个别需求还是要写一些样式，这时就可以使用 `WindiCSS` 进行原子化样式开发，具体可以先熟悉下 [WindiCSS](https://windicss.org/) 的资料。
如何 `WindiCSS` 仍满足不了需求，那么请使用 `import styles from './index.module.css'` 的方式引入模块化样式类避免样式类污染。
当前项目的 css 写法支持嵌套模式，和 less 类似。

## 如何引用静态资源

1. 对于不关心文件变化的文件，统一放到 `public` 目录管理，然后直接使用 `/xxx.xxx` 引用，不用考虑前缀问题
2. 对于文件变化敏感类的文件，希望在文件更新后能及时更新的资源，统一使用 `import xxx from '/path/to/file'` 的方式引入，这样打包后会有 hash 值，如果是在 css 中引入也是写相对路径
3. 所有切图要求做好文件大小压缩，如果是 svg 资源，要求切图前先在 `Sketch` 中将图片转成组件然后统一切图，这样可以移除 svg 中不必要的一些位移属性和压缩时可能出现的一些问题（部分 svg 图片压缩后会出错，此时可以不压缩，但最好删除 svg 文件中一些不需要的代码）。图片压缩推荐 `ImageOptim` 软件

## 如何添加符合规范的表单页面

TODO

## 如何调用后端接口

1. 复制`packages/web`目录下的`.a2s.js.example`到同目录下并重命名为`.a2s.js`，修改`dataSourceOptions.yapi`里的`token`和`headers.Cookie`里的值，其中`token`从[yapi 项目](https://yapi.comunion.io/project/39/setting)里的`设置->token配置`页面找到，而`cookie`从`yapi`登录后的页面`cookie`里获取
2. 在根目录或 `web` 目录执行 `pnpm gen:api` 来生成、更新 api 文件
3. 然后使用 `services[api-group@api-name]` 的形式调用，所有参数都通过第一个参数传递，具体可查看[a2s 文档](https://www.npmjs.com/package/@zidong/a2s)

## 如何发起上链操作

TODO

1. 在写代码前，请先了解下前后端和合约的整体[交互流程](https://comunion.yuque.com/niwla4/qbn2zb/orqwyo#j7Fkv)以及 [v5 合约架构图](https://comunion.yuque.com/niwla4/qbn2zb/bsqang)。
2. 在根目录或 `web` 目录下执行 `pnpm gen:contract` 来生成、更新合约代码
3. 然后使用 `contracts[contract-name]` 的形式调用，所有参数都通过第一个参数传递，有对应的 ts 提示

## 如何获取用户信息，当前上链信息

1. 当前用户的 token 存储在 localStorage，对应的用户信息使用全局 `hooks` 存储，使用时调用 `useUser` 即可获取，包括当前用户的 profile
2. 当前的钱包连接信息使用全局 `hooks` 存储，使用时调用 `useWallet` 即可，包括当前钱包名称、链的名称、钱包地址

## 依赖管理

建议直接在 vscode 中安装`Monorepo Helper`插件来进行依赖管理和脚本运行

### 全局添加依赖

```bash
pnpm i -w [-D] <pkg>
```

### 子项目添加依赖

```bash
pnpm --filter <@comunion/packageName> add [-D] <pkg>
# 例如
pnpm --filter @comunion/components add lodash
```

如果添加的是 workspace 级别的依赖，应该制定依赖包的版本号

```bash
pnpm --filter @comunion/web add @comunion/utils@0.0.1
```

### 子项目移除依赖

```
pnpm --filter <@comunion/packageName> remove <pkg>
```

## 项目共享代码片段

- `v3c` 创建 Vue 3 组件代码模板
- `v3p` 创建 Vue 3 页面代码模板
