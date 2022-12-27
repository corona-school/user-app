import type { CodegenConfig } from '@graphql-codegen/cli';

// Required by ./config
process.env.NODE_ENV = 'production';
const getClientEnvironment = require('./config/env');

// Usually take the explicit env variable - This is set inside CI and other well configured environments
let schema = process.env.GRAPHQL_SCHEMA_URL;

// If that isn't set, try the one Webpack also builds into the App, this should match to the development setup
if (!schema) {
    const backend = (getClientEnvironment('').raw as any)?.REACT_APP_BACKEND_URL;
    if (backend) {
        schema = `${backend}/apollo`;
    }
}

if (!schema) {
    // In case nobody configured it, fall back to default staging backend
    schema = 'https://corona-school-backend-dev.herokuapp.com/apollo';
}

console.info(`Loading GraphQL Schema from '${schema}'`);

const config: CodegenConfig = {
    overwrite: true,
    schema,
    documents: 'src/**/*.(tsx|ts)',
    generates: {
        'src/gql/': {
            preset: 'client',
            presetConfig: {
                gqlTagName: 'gql',
            },
            plugins: [],
        },
    },
};

export default config;
