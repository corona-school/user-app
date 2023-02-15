import { resources } from '../I18n';

declare module 'react-i18next' {
    interface CustomTypeOptions {
        resources: typeof resources['de'];
        returnNull: false;
    }
}
