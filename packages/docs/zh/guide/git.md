---
layout: doc
title: Git 代码提交流程
sidebar: true
---

本项目使用的 Git 代码提交流程参考 `SourceTree` 的 `git-flow` 流程，做了一些适当的调整，可参考[原流程说明](https://www.jianshu.com/p/8a3988057d0f)

## Git workflow

1. `develop` 作为主要开发分支，所有的开发内容都往该分支合并，该分支不允许直接推送，分支受保护，该分支的代码自动部署到 [https://d.comunion.io](https://d.comunion.io)
2. `release` 作为预发版分支，当需要发布测试版本时从 `develop` 合并到 `release` 分支并推送，该分支代码将自动部署到 [https://test.comunion.io](https://test.comunion.io)
3. `main` 分支作为稳定分支，该分支内容应该是线上版本的代码，当需要发布线上版本时先对 `release` 分支打 tag ，然后从 `release` 分支合并到该分支（同时合并到 `develop` 分支），该分支代码将自动部署到 [https://comunion.io](https://comunion.io)
4. `feat/xxx` 或 `feature/xxx` 作为功能分支，所有的新功能都有一个对应的分支，功能完成后合并到 `develop` 分支，合并完成后会删除远程该分支
5. `fix/xxx` 用于修改预发布版本分支的 bug，完成后合并到 `release` 分支，合并后会删除该远程分支
6. `hotfix/xxx` 线上紧急 bug 修复分支，该分支修复完成后需要同时合并到 `main` 和 `develop` 分支，如果涉及到的修改内容比较多，影响比较大，可以先合并到 `release` 分支，等测试没有问题后再合并到 `main` 分支

## 其它说明

- 上述合并操作不是在本地合并后推送到远程，而是在 Github 页面提交 `Pull Request` 进行合并
- 我们对 git commit message 有一定约束，请使用 `[build|ci|chore|docs|feat|fix|perf|refactor|revert|style|test][(子包名)]: 具体提交内容` 的格式，关于 `commitlint` 的更多信息请查看[https://github.com/conventional-changelog/commitlint](https://github.com/conventional-changelog/commitlint)
