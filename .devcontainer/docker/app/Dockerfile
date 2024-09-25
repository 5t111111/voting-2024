FROM denoland/deno:1.46.3

# Linux の場合、deno ユーザーの UID と GID がホストのユーザーの同一のものに設定されるため、/deno-dir への書き込みでパーミッションエラーが発生することがある
# それを避けるため、DENO_DIR にホームディレクトリ内のパスを設定する
ENV DENO_DIR /home/deno/deno-dir

USER deno
