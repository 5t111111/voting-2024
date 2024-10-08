#!/usr/bin/env bash

set -uo pipefail

cat << EOS

================================================================================
アプリケーションのセットアップ
================================================================================
EOS

cd app

cat << EOS
--------------------------------------------------------------------------------
deno info
--------------------------------------------------------------------------------
EOS

deno info

cat << EOS
--------------------------------------------------------------------------------
依存パッケージの事前インストール (キャッシュ)
--------------------------------------------------------------------------------
EOS

echo 'Running deno cache...'

deno cache main.ts

cat << EOS

================================================================================
セットアップ完了
================================================================================
Dev Container のセットアップが完了しました。

app ディレクトリに移動して、deno task start で開発サーバーを起動してください。

$ cd app
$ deno task start

EOS
