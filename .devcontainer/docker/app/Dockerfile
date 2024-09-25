FROM denoland/deno:1.46.3

# Linux の場合、deno ユーザーの UID と GID がホストのユーザーの同一のものに設定されるため、/deno-dir への書き込みでパーミッションエラーが発生することがある
# それを避けるため、単純に /deno-dir のパーミッションを 777 に設定しておく
RUN chmod 777 /deno-dir

USER deno
