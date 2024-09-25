#!/usr/bin/env bash

set -euo pipefail

cat << EOS

================================================================================
事前チェックを行なっています...
================================================================================
EOS

APP_ENV_PATH="app/.env"

if [ ! -f ${APP_ENV_PATH} ]; then
  echo "${APP_ENV_PATH} が存在しません。${APP_ENV_PATH}.example からコピーして作成します。"
  cp ${APP_ENV_PATH}.example ${APP_ENV_PATH}
else
  echo "${APP_ENV_PATH} ...OK"
fi

cat << EOS

...チェック完了
EOS
