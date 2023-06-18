#! /usr/bin/env bash

set -eo pipefail

appVersion=${HEROKU_SLUG_COMMIT:-latest}
env=${DD_ENV:-dev}
serviceName=${SERVICE_NAME:-user-app}


# RUM should not be active in our review apps
if [ "$env" == "dev" ]; then
	echo "Not uploading source maps in dev"
	# exit 0
fi

pathPrefix="http://localhost:3000"
case "$env" in
    "dev")
				pathPrefix="https://user-app-feature-includ-3yrdze.herokuapp.com"
        ;;
    "staging")
				pathPrefix="https://lernfair-user-app-dev.herokuapp.com"
        ;;
    "production")
				pathPrefix="https://app.lern-fair.de"
        ;;
esac

echo "Running upload: env: $env, serviceName: $serviceName, appVersion: $appVersion, pathPrefix: $pathPrefix"
./node_modules/.bin/datadog-ci sourcemaps upload ./build --service $serviceName --release-version $appVersion --minified-path-prefix $pathPrefix --repository-url https://github.com/corona-school/user-app --disable-git
