#!/bin/bash

export PATH="/usr/local/bin/:$PATH"

STRATUM_ENV="production"

# Navigate out of .app directory
# TODO: find a way which allow the script to run as shell script and as .app
cd ../../../

STRATUM_APP="$PWD/stratum-app"
MAPPING_FILE="$STRATUM_APP/stratum.mapping.$STRATUM_ENV.json"

if [ -f "$MAPPING_FILE" ]
then
  echo "Mapping file found, launching stratum in debug mode..."
  node $STRATUM_APP $STRATUM_ENV --leap --timer --sound --keys --log-level=debug
else
  echo "No mapping file found : you must run stratum-assistant first."
fi
