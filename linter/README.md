# ESLint extension for the User-App

To ensure some patterns (e.g. concerning security and code quality) are used across the codebase, this folder contains some ESLint rules locally as described [here](https://stevenpetryk.com/blog/custom-eslint-rules/).

To have a look at the AST, [ASTExplorer](https://astexplorer.net/) can be used.

### lernfair-app-linter/typed-gql

Ensures that `gql` is imported from `src/gql`, which is the typed variant of gql that is generated using Apollo Codegen using the Backend Schema.
Unlike the other gqls exported from other libraries, this does not just return `any` and should thus be preferred.