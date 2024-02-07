import React from 'react';
import { NativeBaseProvider } from 'native-base';
import Theme from '../src/Theme';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../src/I18n';
import { I18nextProvider } from 'react-i18next';
import { MockedProvider } from '@apollo/client/testing';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    i18n,
    locale: 'de-DE',
    locales: {
        de_DE: 'Deutsch',
    },
};

// NOTE: Decorators are only applied to <Story> tags inside MDX!
export const decorators = [
    (Page: () => React.ReactElement) => (
        <I18nextProvider i18n={i18n}>
            <BrowserRouter>
                <NativeBaseProvider theme={Theme}>
                    <MockedProvider mocks={[]}>{Page()}</MockedProvider>
                </NativeBaseProvider>
            </BrowserRouter>
        </I18nextProvider>
    ),
];
