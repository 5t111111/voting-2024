import { z } from "zod";
import { type Vote, voteSchema } from "../schemas/vote.ts";

const KV_PREFIX = "voting-2024";

// Deno Deploy での動作かどうか判定するために、Deno Deploy のプリセット環境変数 DENO_REGION を取得する
const DENO_REGION = Deno.env.get("DENO_REGION");

let kv: Deno.Kv;

// Deno Deploy でなければローカルのファイルを KV データストアとして利用する
if (DENO_REGION) {
  kv = await Deno.openKv();
} else {
  const kvEndpoint = Deno.env.get("DENO_KV_ENDPOINT");
  if (!kvEndpoint) {
    throw new Error("DENO_KV_ENDPOINT is not set");
  }
  kv = await Deno.openKv(kvEndpoint);
}

const itemValueSchema = z.object({ count: z.number() });

type ItemValue = z.infer<typeof itemValueSchema>;

const itemSchema = z.object({
  key: z.tuple([z.literal(KV_PREFIX), voteSchema.shape.id]),
  value: itemValueSchema,
});

type Item = z.infer<typeof itemSchema>;

/**
 * KV に保存されている各投票先候補の投票数に1件追加する
 * 対象の候補のデータが登録されていない場合は新規に作成する
 * 同時のタイミングで投票された場合を考慮して、KV の atomic を利用してトランザクション化しており、
 * トランザクションが失敗した場合は成功するまでリトライするようにしている (最大10回)
 */
export async function incrementCount(id: string) {
  // データが未登録の場合は先に登録する
  await createItemIfNotExist(id);

  const key = [KV_PREFIX, id];

  let res = { ok: false };
  let retryLimit = 10;

  const getRes = await kv.get<ItemValue>(key);
  const currentCount = getRes.value!;

  const incrementedCount = currentCount.count + 1;

  while (!res.ok && retryLimit > 0) {
    res = await kv.atomic()
      .check(getRes) // 変更されていないことをチェック
      .set(key, { count: incrementedCount })
      .commit();
    retryLimit -= 1;
  }
}

/**
 * KV に新規に投票先候補のデータを作成する
 * Deno KV の atomic を利用して、既存で登録されていない場合のみ登録するようにしている
 * @param id
 * @see {@link https://deno.land/manual@v1.35.2/runtime/kv}
 */
async function createItemIfNotExist(id: string) {
  const key = [KV_PREFIX, id];
  const value = { count: 0 };
  const res = await kv.atomic()
    .check({ key, versionstamp: null }) // `null` versionstamps mean 'no value'
    .set(key, value)
    .commit();
  if (res.ok) {
    console.log(`Candidate [${id}] did not yet exist. Newly created!`);
  }
}

/**
 * KV に登録されている候補すべての投票データを取得する
 * @returns 投票データのリスト
 */
export async function getAllItems(): Promise<Vote[]> {
  const items: Item[] = [];

  for await (const entry of kv.list<ItemValue>({ prefix: [KV_PREFIX] })) {
    const parseResult = itemSchema.safeParse(entry);

    // Zod でのパースに失敗した場合はその項目は無視する
    if (!parseResult.success) {
      // console.error(parseResult.error);
      continue;
    }

    const item = parseResult.data;

    items.push({
      key: item.key.map((key) => key.toString()) as Item["key"],
      value: item.value!,
    });
  }

  return items.map((item) => ({ id: item.key[1], count: item.value.count }));
}
