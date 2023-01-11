const getClientEnvironment = require('../config/env');
const webpack = require('webpack');

module.exports = {
    stories: [
        // Storybook Stories can also be written in .tsx, though I guess markdown is the preferred way of writing documentation
        // Thus we enforce a unified usage here:
        '../src/**/*.stories.mdx',
    ],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions', 'storybook-react-i18next'],
    framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-webpack5',
    },
    webpackFinal: (storybookConfig) => {
        const appConfig = require('./../config/webpack.config.js')('development');
        // This hacks in support for SCSS, Typescript and React Native module resolution into the Webpack configuration of Storybook
        // None of the documented ways of supporting those worked in our setup
        storybookConfig.resolve = appConfig.resolve;
        storybookConfig.module.rules.push({
            test: /\.scss$/i,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
        });

        // This was added to support svgs in Storybook by excluding svgs in the fileLoaderRule in the base config of Storybook
        const fileLoaderRule = storybookConfig.module.rules.find((rule) => !Array.isArray(rule.test) && rule.test.test('.svg'));

        fileLoaderRule.exclude = /\.svg$/;

        storybookConfig.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: require.resolve('@svgr/webpack'),
                    options: {
                        prettier: true,
                        svgo: true,
                        titleProp: false,
                        ref: false,
                    },
                },
            ],
        });
        // Support for process.env.*
        storybookConfig.plugins.push(new webpack.DefinePlugin(getClientEnvironment('').stringified));

        return storybookConfig;
    },
};
