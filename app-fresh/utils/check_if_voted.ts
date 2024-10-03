export function checkIfVoted(votedAt: number | undefined): boolean {
  // 投票していない場合は false を返す
  if (!votedAt) {
    return false;
  }

  // 現在時刻のタイムスタンプとの差分を取得する
  const diff = new Date().getTime() - votedAt;

  // 1分以内に投票していたら投票済みとみなす
  // return diff < 60000;
  return diff < 1000;
}
