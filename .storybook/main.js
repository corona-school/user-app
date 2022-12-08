module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  "webpackFinal": (storybookConfig) => {
    const appConfig = require("./../config/webpack.config.js")('development');
    storybookConfig.resolve = appConfig.resolve;
    storybookConfig.module.rules.push(
      {
        test: /\.scss$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      }
    );
    return storybookConfig;
  }
}