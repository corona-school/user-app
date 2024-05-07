# LernFair User App

The user app provides a user interface for pupils and helpers and talks with the [backend](https://github.com/corona-school/backend) via GraphQL.

To develop locally, install all dependencies with `npm ci`, then use `npm start` to start a development server on port 3000 that talks to the "dev backend" (our staging landscape). Unit tests can be run with `npm run test`. To test out the productive deployment build the app with `npm run build`, then run `PORT=3000 npm run serve` to start the server on the specified port.

`npm start` will start GraphQL Codegen in Watch mode - to check GraphQL queries and generate types for them - and the React Development server in two separate processes. For a better development experience one can also `npm run start-graphql` and `npm run start-dev-server` in two separate shells.

## Query Parameters

These Query Parameters can be supplied to any path of the User-App:

**?temporary** opens the App in a temporary session where all credentials are stored in Session Storage instead of Local Storage and no Device Token is created.
Thus each tab opened with this query parameter uses a different session and closing the tab invalidates the session. This is very useful for local testing and troubleshooting issues when logging in as a user.

**?secret_token=authtokenP1** logs in the user using the "legacy authToken". There are some well known tokens for test users, i.e. `authtokenP1`, `P2`, ... for pupils and `authtokenS1`, `S2`, ... for students.

## Development Tools

Documentation about Components can be found in **[Storybook](https://corona-school.github.io/user-app/)**.

To open the Storybook with documentation about components locally, install optional dependencies with `npm run dev-install`,
then storybook can be started with `npm run dev-storybook`. To add documentation, add [CSF files](https://storybook.js.org/docs/api/csf) into the source folder (named .stories.tsx).
A basic CSJ file looks like this:

```tsx
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import Component from './Component';

type Story = StoryObj<typeof Component>;
const meta: Meta<typeof Component> = {
    title: 'Atoms/Component',
    component: Component,
};

export const Base: Story = {
    name: 'Component',
    render: (props) => <Component {...props} />,
};

export default meta;
```

## Structure

This repository is set up as a React Native app although it is currently only shipped as a web app.
In the future it might be desirable to also offer native apps.

## Translations

All texts are stored in i18n JSON files in `/src/lang` to simplify translation of the app. The app is primarily maintained in german in `de.json`, other translation files can be synced automatically with the following command, which takes all texts in the german version and sends them to Weglot, our translation provider:

```
WEGLOT_API_KEY=... npm run translate
```

With `npm run translate -- check` one can check whether all translations are maintained (this is also run in the main Barrier). Existing entries in the translation files should not be changed when changing the UI, instead add new entries to the language file and delete the old entries (for the automatic translation to diff properly).

To translate a new language, create a new language file `[ISO639-1 language code].json` with an empty object `{}` in it, then run the translation script and will pick it up and fill it. Include the file in `I18n.ts`.

For manual translation, with `npm run translate -- export` one can generate a diff file that contains all the translations that were added or changed _between the current HEAD and the point where it branched of the last time from main_. For example to manually review all the changes that came in with `feat/something`, just checkout that branch and run the export command.
As a result, a new file is written to the `src/lang` folder, which looks like this:

```
# email    <- path in the translation file
E-Mail     <- original german translation
e-mail     <- current translation (i.e. from Weglot)

...
```

This file can then be shared with translators, which can just delete all entries from the file that look good, and they can then just adapt the third line in each group with the translation. When placing the modified file back in `src/lang`, one can run `npm run translate -- import`, which will compare the german translation with the current state in the repo, and if it matches, it'll replace the desired translation. This can also be done after the automatic translation was deployed, as long as the german entries were not changed in the meantime.

## Configuration

Most configuration is done via `REACT_APP_` environment variables, which are inlined into the bundled version when the app is built. However as the app is only built once in Heroku and used for both staging and production and it is desirable to be able to change certain configuration without rebuilding the app, there is a separate mechanism for configuration: `RUNTIME_` variables added to the server (i.e. `RUNTIME_BACKEND_URL=https://example.com npm run serve`) are injected into `window.liveConfig`, where they can be read by frontend code. Changing these only requires the server process to restart, clients will then pick them up once the page is reloaded (while the bundle is still cached).

A full list of environment variables can be found in [`src/types/react-app-env.d.ts`](src/types/react-app-env.d.ts).

In local development environment you can use [`.env.template`](.env.template) as template for in your own .env file.

## Bundles and Lazy Loading

The App is split into multiple bundles to reduce initial load time, as well as increasing caching during updates. To analyze and optimize the bundle, run `npm run analyze-bundle`, then open `build/source-map.html` in a browser.

The main bundle only contains the [`Navigator`](./src/routing/Navigator.tsx) component,
which only provides the GraphQL client library, the user context and the login and landing pages. Thus the bundle contains everything for the first load. Unauthenticated users can then already start to log in, whereas authenticated users and visitors of specific pages will instead see a loading spinner while the [`NavigatorLazy`](./src/routing/NavigatorLazy.tsx) is loaded. We assume that these users already opened the App before, and thus already have the page cached (thus the main bundle is optimized for first visitors).

The same mechanism is used by `IconLoader` and `IconLoaderLazy` to lazily load icons - as the page usually also works without icons.

Lazy Loading uses [Webpack Code Splitting](https://webpack.js.org/guides/code-splitting/) with a custom wrapper around `React.lazy` called [`lazyWithRetry`](./src/lazy.ts) - which tries again in case a chunk failed to load due to network connectivity problems.

## Further Resources

-   [Create React App Documentation](https://github.com/facebook/create-react-app)
-   [React documentation](https://reactjs.org/)

## Contributing

We're always happy and open about contributions, please [contact the HR team](mailto:team@lern-fair.de) in case you are interested in joining our team of volunteers.

## Security Issues

We follow the guidelines for responsible disclosure: If you find a vulnerability, we would encourage you to [contact Support](mailto:support@lern-fair.de) and gives us some time to tackle the issues, before publishing it. We take security very seriously and these issues are automatically highest priority for us. Since we are a non-profit organization with not much of a budget, we can't offer a bug bounty program.
