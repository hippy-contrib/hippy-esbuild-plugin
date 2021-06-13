# webpack-esbuid-plugin

开发环境下直接使用 [esbuild](https://esbuild.github.io/) 打包，大大提升开发效率和体验

# Usage

第一步：安装 npm 包

```sh
tnpm i esbuild-loader @tencent/webpack-esbuild-plugin -D
```

第二步：修改项目下的 `webpack.config.js` 配置

```js
const WebpackESBuildPlugin = require('@tencent/webpack-esbuild-plugin');

module.exports = {
  plugins: [new WebpackESBuildPlugin()],
}
```

# Features

- 在 `development` 模式下直接使用 esbuild 打包，大大提升开发效率和体验
- `watch` 模式下提供文件变更、重新打包、打包时间等更友好的命令行提示