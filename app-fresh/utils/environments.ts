export const isDenoDeploy = () => {
  // Deno Deploy での動作かどうか判定するために、Deno Deploy のプリセット環境変数 DENO_REGION を取得する
  if (Deno.env.get("DENO_REGION")) {
    return true;
  }

  return false;
};
