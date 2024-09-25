export const isDenoDeploy = () => {
  // Deno Deploy での動作かどうか判定するために、Deno Deploy のプリセット環境変数 DENO_REGION を取得する
  if (Deno.env.get("DENO_REGION")) {
    return true;
  }

  return false;
};

export const isProd = () => {
  // Deno Deploy 判定されたら本番判定
  if (isDenoDeploy()) {
    return true;
  }

  // DENO_ENV が production であれば本番判定
  if (Deno.env.get("DENO_ENV") === "production") {
    return true;
  }

  return false;
};
