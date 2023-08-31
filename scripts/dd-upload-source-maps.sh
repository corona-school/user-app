#! /usr/bin/env bash

set -eo pipefail

appVersion=${HEROKU_SLUG_COMMIT:-latest}
env=${DD_ENV:-dev}
serviceName=${SERVICE_NAME:-user-app}


# RUM should not be active in our review apps
if [ "$env" == "dev" ]; then
	echo "Not uploading source maps in dev"
	exit 0
fi

paths=()
case "$env" in
    "staging")
				paths=("https://lernfair-user-app-dev.herokuapp.com")
        ;;
    "production")
				paths=("https://app.lern-fair.de" "https://my.lern-fair.de" "https://my.corona-school.de")
        ;;
		*)
				echo "Invalid env: $env; Should be one of staging, production"
				exit 1
				;;
esac

for path in "${paths[@]}"; do
	echo "Running upload: env: $env, serviceName: $serviceName, appVersion: $appVersion, path: $path"
	./node_modules/.bin/datadog-ci sourcemaps upload ./build --service $serviceName --release-version $appVersion --minified-path-prefix $path --repository-url https://github.com/corona-school/user-app --disable-git
done
