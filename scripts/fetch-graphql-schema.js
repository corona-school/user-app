const { execSync } = require("child_process");
const { existsSync, mkdirSync } = require("fs");
const chalk = require('chalk');

// Required by ./config
process.env.NODE_ENV = 'production';
const getClientEnvironment = require("../config/env");

// Usually take the explicit env variable - This is set inside CI and other well configured environments
let schema = process.env.GRAPHQL_SCHEMA_URL;

// If that isn't set, try the one Webpack also builds into the App, this should match to the development setup
if (!schema) {
  const backend = getClientEnvironment("").raw?.REACT_APP_BACKEND_URL;
  if (backend) {
    schema = `${backend}/apollo`;
  }
}

if (!schema) {
  // In case nobody configured it, fall back to default staging backend
  schema = "https://corona-school-backend-dev.herokuapp.com/apollo";
}

console.info(chalk.bgBlue.white(
    `+ ------------------ Fetch GraphQL Schema -----------------------+\n` +
    `| from '${schema}'\n` + 
    `| into src/gql/schema.json`
));

try {
    if (!existsSync('src/gql')) mkdirSync('src/gql');
    execSync(`apollo-codegen introspect-schema ${schema} --output src/gql/schema.json`);
} catch(error) {
    if (!existsSync("src/gql/schema.json")) {
        console.error(chalk.bgRed.white.bold(
            `| Could not fetch the GraphQL Schema and no local cache present!\n` +
            `+ ---> Is the backend running and reachable?`
        ));
        process.exit(1);
    }
    console.warn(chalk.bgYellow.white.bold(`| Failed to fetch Schema, but cached locally`));
} 

console.info(chalk.bgBlue.white(
        `+ ------------------ Fetched GraphQL Schema ---------------------+`
) + '\n\n');