## 模块机制

`src/main.js` 会自动加载 `src/modules` 下的安装模块。

- 核心模块：放在 `src/modules/core`，并 `eager` 引入
- 可选模块：放在 `src/modules` 根目录，默认按需异步加载（文件名需匹配 `*.install.js`）

模块格式：

```js
/**
 * @type {import('~/types').UserModule}
 */
export function install({ app, router }) {
  // app.use(...)
  // router.addRoute(...)
}
```

建议命名：`xxx.install.js`，这样能被自动扫描加载。
