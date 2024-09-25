FROM denoland/deno:1.46.3

# ホストの OS によっては Dev Container での起動時にデフォルトユーザーの UID:GID を 1000:1000 に設定するため、
# UID:GID と Deno が利用するキャッシュディレクトリの所有者を合わせておく (デフォルトは 1993)
RUN usermod -u 1000 deno && \
    groupmod -g 1000 deno

RUN chown deno:deno /deno-dir

USER deno
