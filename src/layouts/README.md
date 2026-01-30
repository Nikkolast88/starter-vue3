## 布局组件

此目录用于存放应用布局组件（Header / Sidebar / Footer 等），不会被文件路由扫描。

推荐用法：

- 页面内直接包裹内容
- 作为父级页面布局，子页面通过 `<RouterView />` 注入

示例：

```vue
<script setup>
import MainLayout from '~/layouts/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <RouterView />
  </MainLayout>
</template>
```
