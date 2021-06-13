const { Signale } = require('signale');

const getEsbuildLoader = (loader = 'tsx', target = 'es2015') => ({
  loader: 'esbuild-loader',
  options: {
    loader,
    target,
  },
});

const plugin = 'WebpackESBuildPlugin';

class WebpackESBuildPlugin {
  constructor(options = {}) {
    // eslint-disable-next-line no-console
    this.logger = options?.logger
      || new Signale({
        config: {
          displayLabel: false,
          displayTimestamp: true,
        },
      });

    // count build times
    this.count = 1;
    this.options = options;
  }

  apply(compiler) {
    if (compiler.options.mode !== 'development') return;
    compiler.hooks.afterEnvironment.tap(plugin, () => {
      // eslint-disable-next-line no-param-reassign
      compiler.options.module.rules = compiler.options.module.rules.map((rule) => {
        const { test, use } = rule;
        const loaderMatch = test.toString().match(/[jt]sx?/)?.[0];
        if (!loaderMatch) return rule;

        const filteredUse = use.filter(({ loader }) => !['babel-loader', 'ts-loader'].includes(loader));
        return {
          test,
          use: [getEsbuildLoader(loaderMatch), ...filteredUse],
        };
      });

      const typescriptExtensions = ['.ts', '.tsx'];
      compiler.options.resolve.extensions.unshift(...typescriptExtensions);
    });

    compiler.hooks.watchRun.tap(plugin, (compiler) => {
      const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes).map(file => file.replace(`${process.cwd()}/`, ''));
      if (changedFiles.length > 0) {
        this.logger.info(`文件发生改动：${changedFiles.join(', ')}`);
      }
      this.logger.start(`开始第 ${this.count} 次构建...`);
    });

    compiler.hooks.done.tap(plugin, (stats) => {
      const { startTime, endTime } = stats;
      const spendTime = endTime - startTime;
      this.logger.success(`第 ${this.count} 次构建成功，用时：${spendTime}ms`);
      this.count += 1;
    });
  }
}

module.exports = WebpackESBuildPlugin;
