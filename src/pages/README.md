# 注意

## route

页面路由由文件结构自动生成（vue-router v5 file-based routing），以 `index.vue` 作为页面入口。

- 普通路由：`pages/about.vue` → `/about`
- 嵌套路由：`pages/users/index.vue` → `/users`
- 动态路由：`pages/users/[id].vue` → `/users/:id`
- 兜底路由：`pages/[...path].vue` → `/:path(.*)`

## store

单独配置pinia
