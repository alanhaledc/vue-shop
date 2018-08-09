# vue-shop

> A  Vue.js project using quasar-framework

### 技术栈

**vue全家桶 + quasar-cli + koa2 + mongoDB**

### 项目结构

```bash
|—— src              前端相关代码
|—— server           后端相关代码
...                  其他
|—— quasar.conf.js   quasar框架主要配置文件
```

### 说明

- 灵感来源于一个全桟课程，自己用 vue 和 koa2完全重构了前后端代码。
- 这是一个商城网站。[演示地址](http://shop.haledeng.com)

### 安装和启动

```b
# 安装前端依赖和启动前端服务
yarn install && quasar dev

# 安装后端依赖和启动后端服务
cd server
yarn install && yarn serve

# 前端生产环境代码打包
quasar build
```
