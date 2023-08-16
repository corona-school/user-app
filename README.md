# LernFair User App

The user app provides a user interface for pupils and helpers and talks with the [backend](https://github.com/corona-school/backend) via GraphQL.

To develop locally, install all dependencies with `npm ci`, then use `npm start` to start a development server on port 3000 that talks to the "dev backend" (our staging landscape). Unit tests can be run with `npm run test`. To test out the productive deployment build the app with `npm run build`, then run `PORT=3000 npm run serve` to start the server on the specified port.

`npm start` will start GraphQL Codegen in Watch mode - to check GraphQL queries and generate types for them - and the React Development server in two separate processes. For a better development experience one can also `npm run start-graphql` and `npm run start-dev-server` in two separate shells.

## Query Parameters

These Query Parameters can be supplied to any path of the User-App:

**?temporary** opens the App in a temporary session where all credentials are stored in Session Storage instead of Local Storage and no Device Token is created.
 Thus each tab opened with this query parameter uses a different session and closing the tab invalidates the session. This is very useful for local testing and troubleshooting issues when logging in as a user.

**?token=authtokenP1** logs in the user using the "legacy authToken". There are some well known tokens for test users, i.e. `authtokenP1`, `P2`, ... for pupils and `authtokenS1`, `S2`, ... for students.

## Development Tools

Documentation about Components can be found in **[Storybook](https://corona-school.github.io/user-app/)**.

To open the Storybook with documentation about components locally, install optional dependencies with `npm run dev-install`, 
 then storybook can be started with `npm run dev-storybook`. To add documentation, add [MDX Files](https://storybook.js.org/docs/react/api/mdx) into the source folder (named .stories.mdx!). React Components must always be wrapped in the `<Story>` Component. In case a story shows a white screen, check the browser debug logs like in any other React app.
A basic MDX file looks like this:

```md
import { Meta, Story } from '@storybook/addon-docs';
import SomeComponent from "./SomeComponent";

<Meta title="Some Component" component={SomeComponent} />

# Example Component

<Story name="Some Component used in some way">
  <Component />
</Story>

# Example Component with State

You can also use `useState` like this:

<Story name="Some stateful Component">
{() => {
  const [active, setActive] = useState(false);
  return <Component active={active} onSomething={() => setActive(true)} />
}}
</Story>
```

## Structure

This repository is set up as a React Native app although it is currently only shipped as a web app. 
In the future it might be desirable to also offer native apps.

All texts are stored in i18n files in `/src/lang` to simplify translation of the app in the future.


## Configuration

Most configuration is done via `REACT_APP_` environment variables, which are inlined into the bundled version when the app is built. However as the app is only built once in Heroku and used for both staging and production and it is desirable to be able to change certain configuration without rebuilding the app, there is a separate mechanism for configuration: `RUNTIME_` variables added to the server (i.e. `RUNTIME_BACKEND_URL=https://example.com npm run serve`) are injected into `window.liveConfig`, where they can be read by frontend code. Changing these only requires the server process to restart, clients will then pick them up once the page is reloaded (while the bundle is still cached).

A full list of environment variables can be found in [`src/types/react-app-env.d.ts`](src/types/react-app-env.d.ts). 

In local development environment you can use [`.env.template`](.env.template) as template for in your own .env file.

## Bundles and Lazy Loading

The App is split into multiple bundles to reduce initial load time, as well as increasing caching during updates. To analyze and optimize the bundle, run `npm run analyze-bundle`, then open `build/source-map.html` in a browser. 

The main bundle only contains the [`Navigator`](./src/Navigator.tsx) component, 
 which only provides the GraphQL client library, the user context and the login and landing pages. Thus the bundle contains everything for the first load. Unauthenticated users can then already start to log in, whereas authenticated users and visitors of specific pages will instead see a loading spinner while the [`NavigatorLazy`](./src/NavigatorLazy.tsx) is loaded. We assume that these users already opened the App before, and thus already have the page cached (thus the main bundle is optimized for first visitors).

The same mechanism is used by `IconLoader` and `IconLoaderLazy` to lazily load icons - as the page usually also works without icons.

Lazy Loading uses [Webpack Code Splitting](https://webpack.js.org/guides/code-splitting/) with a custom wrapper around `React.lazy` called [`lazyWithRetry`](./src/lazy.ts) - which tries again in case a chunk failed to load due to network connectivity problems. 

## Further Resources

- [Create React App Documentation](https://github.com/facebook/create-react-app)
- [React documentation](https://reactjs.org/)

## Contributing

We're always happy and open about contributions, please [contact the HR team](mailto:team@lern-fair.de) in case you are interested in joining our team of volunteers.

## Security Issues

We follow the guidelines for responsible disclosure: If you find a vulnerability, we would encourage you to [contact Support](mailto:support@lern-fair.de) and gives us some time to tackle the issues, before publishing it. We take security very seriously and these issues are automatically highest priority for us. Since we are a non-profit organization with not much of a budget, we can't offer a bug bounty program. 