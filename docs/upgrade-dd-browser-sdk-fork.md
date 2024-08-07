# Upgrade DD browser SDK

To use the Datadog browser SDK in our application, we had to make some changes to the original repository.
This was necessary to comply with GDPR and to ensure our users cannot be tracked across different pages.

Therefore, we decided to fork the original repository and apply the changes there.
This document describes the steps to upgrade the forked repository to the latest version of the original repository.

## Prerequirements

-   Install webpack globally. It should match the version in the project. Otherwise, the build might fail 😞

    ```bash
    npm install -g webpack@<webpack_version_used_by_sdk>
    npm install -g webpack-cli@<webpack_version_used_by_sdk>
    ```

-   Ensure that your global typescript version is the same as the one in the project. Otherwise, the build might fail 😞

    ```bash
    npm install -g typescript@<typescript_version_used_by_sdk>
    ```

## Setup

1. Clone repository

    ```bash
    git clone git@github.com:corona-school/browser-sdk.git
    ```

2. Add official repository as second remote
    ```bash
    git remote add dd https://github.com/DataDog/browser-sdk.git
    ```

## Update

1. Update main branch of our forked repository

    ```bash
    git pull dd main
    git push origin main
    ```

2. Find latest tag, like `5.22` in [git history](https://github.com/DataDog/browser-sdk/commits/main/)
3. Checkout commit of version change, like [this one](https://github.com/DataDog/browser-sdk/commit/24816d2e1bcb954eb9070fe477b2f83585d7c980)

    It's not the tag itself, but the merge commit that changes the version in `package.json`

4. Create new branch, based on commit above with the following name:

    ```bash
    git checkout -b <used_version>-lern-fair-changes
    ```

    Like `v5.22-lern-fair-changes` for version `v5.22`

5. Apply our required changes like in [this PR](https://github.com/corona-school/browser-sdk/pull/14)

    - We have to remove some elements from `.gitignore`, so that we are able to build and commit all files
    - The rum package need to refer to our new rum package. It's important that we'll use the name of the branch from the next step, not the current one!

6. Push the changes and create a `draft PR` for our `<used_version>-lern-fair-changes` branch

    Copy the PR description from the old PR of the last version to ensure that all information is available.

7. Create second branch based on first one, like `v5.22-lern-fair-packages`

    The idea is that this branch will include all compiled packages that can be used later.
    This helps to distinguish between the changes we made and the compiled packages.

    ```
    git checkout -b <used_version>-lern-fair-packages
    ```

8. Push branch without any change

    - It’s required to have the branch available before building as it's referenced in the rum package.json already.

9. Build all packages

    This will generate all esm/cjs/d.ts files, which are required to use the module as npm dependency later on:
    You can find an [example PR here](https://github.com/corona-school/browser-sdk/pull/15)

    ```bash
    yarn install
    npm run build
    npm run build:bundle
    ```

    It's very important that these steps are successful.
    If one of them fail in the middle, we can't use the module in our user-app.

10. Commit & Push changes to `<used_version>-lern-fair-packages` branch

11. Create a PR for the `<used_version>-lern-fair-packages` branch

    Copy the PR description from the old PR of the last version to ensure that all information is available.

### Update user-app dependency

1. Change dependency in the user app [package.json](https://github.com/corona-school/user-app/blob/3f9efae60fe49f5bf0987e2b5e24dd08a3d4ab59/package.json#L9)
2. Install new dependency

    ```bash
    yarn install
    ```

3. Create PR and test changes

### Test changes

1. Open review environment of your PR
2. Create `RUNTIME_DD_ENV=review` environment variable in Heroku
3. Copy the following environment variables from `lernfair-user-app-dev` to your review environment

    - DD_ENV, DATADOG_SITE, DATADOG_API_KEY, RUNTIME_DD_APP_ID, RUNTIME_DD_CLIENT_TOKEN

4. Open application link and check:
    - Ensure that your ad-blocker is disabled for your review application
    - Check if the application sets any cookie
    - You should have a `_dd_s` session storage entry
    - Login with test user and click around a little bit to generate a session
    - [Check Datadog](https://app.datadoghq.eu/rum/sessions?query=%40type%3Asession%20%40application.id%3A910732b4-a777-4007-8953-28f7c6ee27b4%20env%3Areview&agg_m=count&agg_m_source=base&agg_t=count&cols=&sort_by=time&sort_order=desc&track=rum&viz=stream&from_ts=1720371028266&to_ts=1720975828266&live=true) to see if your session is there
        - Watch session replay to see if all information are replaced with xxxx
