import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
    base: 'light',
    brandTitle: 'Lern-Fair',
    brandImage: 'https://assets-global.website-files.com/63906379538296472e0ae3d2/63a1e5e3d91c5d153f5906ef_Lern-fair_logo-horizontal.svg',
    brandUrl: 'https://www.lern-fair.de/',
    colorPrimary: '#00494f',
    appBorderColor: '#edf4f3',
    textColor: '#00334ccc',
    colorSecondary: '#00494f',

    barTextColor: '#00334ccc',
    barSelectedColor: '#00494f',
    barHoverColor: '#00334ccc',
    barBg: '#ffffff',

    inputBorder: '#f4f4f4',

    buttonBg: '#EDF4F3',
});

addons.setConfig({
    theme,
});
