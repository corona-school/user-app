import type { StorybookConfig } from '@storybook/react-webpack5';
import getClientEnvironment from '../config/env';
import { DefinePlugin } from 'webpack';

const webpackFinal = (storybookConfig) => {
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
    storybookConfig.plugins.push(new DefinePlugin(getClientEnvironment('').stringified));

    return storybookConfig;
};

const config: StorybookConfig = {
    framework: '@storybook/react-webpack5',
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        'storybook-react-i18next',
        '@storybook/addon-webpack5-compiler-babel',
    ],
    staticDirs: ['../public'],
    webpackFinal,
    babel: async (options) => ({
        ...options,
        presets: [
            ...(options.presets || []),
            [
                '@babel/preset-react',
                {
                    runtime: 'automatic',
                },
                'preset-react-jsx-transform',
            ],
        ],
    }),
    docs: {
        autodocs: 'tag',
    },
};

export default config;
