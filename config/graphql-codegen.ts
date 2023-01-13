import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/gql/schema.json',
  documents: "src/**/*.(tsx|ts)",
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
