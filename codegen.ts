
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GRAPHQL_SCHEMA_URL ?? "https://corona-school-backend-dev.herokuapp.com/apollo",
  documents: "src/**/*.tsx",
  generates: {
    "src/gql/": {
      preset: "client",
      presetConfig: {
        gqlTagName: 'gql',
      },
      plugins: []
    }
  }
};

export default config;
