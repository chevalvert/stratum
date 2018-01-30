#!/bin/bash

export PATH="/usr/local/bin/:$PATH"

STRATUM_ENV="production"

# Navigate out of .app directory
# TODO: find a way which allow the script to run as shell script and as .app
cd ../../../

STRATUM_APP="$PWD/stratum-app"
STRATUM_ASSISTANT="$PWD/stratum-assistant"
STRATUM_LOGS="$PWD/stratum-logs"
MAPPING_FILE="$STRATUM_APP/stratum.mapping.$STRATUM_ENV.json"

mkdir -p $STRATUM_LOGS

if [ -f "$MAPPING_FILE" ]
then
  echo "Mapping file found, launching stratum (+ stratum-assistant in standby mode)..."
  node $STRATUM_APP $STRATUM_ENV --leap --timer --sound --log=$STRATUM_LOGS/$(date +%Y-%m-%d_%H-%M).log & node $STRATUM_ASSISTANT/server $MAPPING_FILE --standby
else
  echo "No mapping file found, launching stratum-assistant..."
  node "$STRATUM_ASSISTANT/server" $MAPPING_FILE
fi
