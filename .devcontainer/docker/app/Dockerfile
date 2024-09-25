FROM denoland/deno:1.46.3

# Dev Container がデフォルトユーザーを UID:GID 1000:1000 に設定するため、キャッシュディレクトリの所有者を合わせておく
RUN chown 1000:1000 /deno-dir

USER deno
