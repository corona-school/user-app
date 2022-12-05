# LernFair User App

The user app provides a user interface for pupils and helpers and talks with the [backend](https://github.com/corona-school/backend) via GraphQL.

To develop locally, install all dependencies with `npm ci`, then use `npm start` to start a development server on port 3000 that talks to the "dev backend" (our staging landscape). Unit tests can be run with `npm run test`. To test out the productive deployment build the app with `npm run build`, then run `PORT=3000 npm run serve` to start the server on the specified port.

To analyze and optimize the bundle, run `npm run analyze-bundle`, then open `build/source-map.html` in a browser. 

## Structure

This repository is set up as a React Native app although it is currently only shipped as a web app. 
In the future it might be desirable to also offer native apps.

All texts are stored in i18n files in `/src/lang` to simplify translation of the app in the future.


## Configuration

Most configuration is done via `REACT_APP_` environment variables, which are inlined into the bundled version when the app is built. However as the app is only built once in Heroku and used for both staging and production and it is desirable to be able to change certain configuration without rebuilding the app, there is a separate mechanism for configuration: `RUNTIME_` variables added to the server (i.e. `RUNTIME_BACKEND_URL=https://example.com npm run serve`) are injected into `window.liveConfig`, where they can be read by frontend code. Changing these only requires the server process to restart, clients will then pick them up once the page is reloaded (while the bundle is still cached).

A full list of environment variables can be found in [`src/types/react-app-env.d.ts`](src/types/react-app-env.d.ts). 


## Further Resources

- [Create React App Documentation](https://github.com/facebook/create-react-app)
- [React documentation](https://reactjs.org/)

## Contributing

We're always happy and open about contributions, please [contact the HR team](mailto:team@lern-fair.de) in case you are interested in joining our team of volunteers.

## Security Issues

We follow the guidelines for responsible disclosure: If you find a vulnerability, we would encourage you to [contact Support](mailto:support@lern-fair.de) and gives us some time to tackle the issues, before publishing it. We take security very seriously and these issues are automatically highest priority for us. Since we are a non-profit organization with not much of a budget, we can't offer a bug bounty program. 