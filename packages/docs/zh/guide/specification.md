---
layout: doc
title: 代码开发规范
sidebar: true
---

随着团队人数的增加，每个人的代码编写喜好不同，代码风格也迥然不同。如果 team 统一了代码风格和编程规范可以带来很多裨益：

1. 降低新成员融入团队的成本, 同时也一定程度避免挖坑；
2. 提高开发效率、团队协作效率, 降低沟通成本；
3. 实现高度统一的代码风格，方便 review, 另外一方面可以提高项目的可维护性；
4. 提高代码的可测试性，有利于前端自动化的落地；
5. 代码中不要出现中文注释，若必须使用，应该使用英文注释。其它文件写法应该在`xxx_zh.md`中使用

## 代码规范

### 基础 es6+语法规范

1. [Style Guide](https://bestofjs.org/projects/airbnb-style-guide)

2. [Clean Code](https://bestofjs.org/projects/clean-code)

### 代码命名规范，要求见名知意

_基础要求代码级注释，特殊业务添加注释说明_

常用命名规则：大驼峰命名（TestCode）、小驼峰命名（testCode）、中划线命名（test-code）、下划线命名（test_code）、大写的蛇形（TEST_CODE）

- 大驼峰命名：一般应用于 Class、interface、构造函数、组件名称等；
- 小驼峰命名：变量命名、函数等；
- 中划线命名：一般用于文件名的命名方式、枚举数据的值、object 的 key 等；
- 下划线命名：使用方式同小驼峰命名，对于我们自己项目中使用的是比较少的；
- 大写的蛇形命名: 一般用于常量命名；

##### 变量命名

1. 表示 boolean 值类型： btnEnabled、btnDisabled、canUse ......
2. 表示 string 值类型： userId、recordKey ......
3. 表示 number 值类型： recordIndex、userCount ......
4. 表示 array 值类型： users、categories ......
5. 表示 map/object (key-value) 值类型： userByIdMap、userByIdObj ......
6. 其他类型可以遵从上述命名规则进行规范化命名

##### fetch 函数命名规范

动词 + 名词

| 请求方式 | 函数前缀               | 举例                    | 说明         |
| :------: | :--------------------- | :---------------------- | :----------- |
|   GET    | get / list             | getUser / listUsers     | 获取用户信息 |
|   POST   | create / submit / save | createUser / submitUser | 创建用户信息 |
|   PUT    | update / modify        | updateUser / modifyUser | 更新用户信息 |
|  DELETE  | del / delete           | delUser / deleteUser    | 删除用户信息 |
|   xxx    | xxx                    | xxx                     | 其他扩展     |

##### 事件函数命名规范

1. `onXXXChange: onUserChange` 主要涉及到表单控件事件命名。如果组件是明确的，如：`UserSelect` ,`change`事件可以简单命名为 onChange（注：组件需要遵从单一职责规范）

2. 业务函数遵从“动词 + 名词”的命名规范：简单代码示例

```ts
bind / unbind + XXX // bindUser, 绑定用户

disable / enable + XXX // disableUser, 禁用用户
```

##### hooks 命名规范

```ts
useXXX // useUser, 涉及用户信息的 hook 业务函数
```

### vue3 书写规范

对引入文件进行分组排版，更方便阅读和文件查找

```ts
// 例：Button.tsx

// 第三方工具包引入区
import { defineComponent, PropType } from 'vue';
import { useRoute } from "vue-router";

// 组件文件引入区
import { Button } from "naive-ui";
import UserInfo from "@/components/UserInfo";

// 数据接口相关文件引入区
import { useUser } from "@/hooks/use-user";
import { User } from "@/interfaces/user-interface";
import { createUser } from "@/apis/user-api";

// 其他工具、样式等文件引入区
import { fmtMonth } from "@/utils/fmt";

export default defineComponent({
  name: 'Button',
  props: {
    className: String,
    enabled: Boolean,
    // 定义props事件函数
    onXXX: Function as PropType<Func>,
  },
  setup(props, ctx) {
    // useXXX: hooks 命名规范，前缀是use
    const { ... } = useXXX();

    return {
      key: value
    };
  },
  render(){
    return (<>{something}</>)
  }
})
```

## 代码提交规范

1. eslint 通过
2. stylelint 通过
3. commitlint 通过
4. 合理的注释，函数一定要有详细注释，组件一定要有`name`，非常见的组件 props 要有注释，必要时要有示例
5. 目录使用`camel-case`格式，组件使用`CameCase`格式，图片等资源使用`came-case`格式，`markdown`文件使用`[lang]/xxx.md`格式

## 图标创建规范

`svg`图标的`fill`和`stroke`尽量使用`currentColor`而不是特定的颜色值

## 国际化注意事项

1. 单复数问题
2. 大小写问题
