import { Handlers, PageProps } from "$fresh/server.ts";

import { Card } from "../components/Card.tsx";
import { Hero } from "../components/Hero.tsx";
import { candidates } from "../data.ts";
import { Head } from "$fresh/runtime.ts";
import { GlobalAppState } from "./_app.tsx";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, GlobalAppState> = {
  async GET(_req, ctx) {
    // // -- テスト用
    // const diff = new Date().getTime() - (session.get("voted_at") as number);
    // const voteResults = await getAllItems();
    const diff = 100;
    const voteResults: string[] = [];
    // // --

    console.log("Index handler: state", ctx.state);

    // コンテキストのステートに設定されている CSRF トークンを取得
    const csrfToken = ctx.state.csrfToken;

    const resp = await ctx.render({ csrfToken, diff, voteResults });

    return resp;
  },
};

export default function Home({ data }: PageProps) {
  const title = "トップ";
  const description = "2024年度版の投票ページです。";

  const { csrfToken, diff, voteResults } = data;

  const voted = false;

  return (
    <>
      <Head>
        <title>{title} | 簡易投票システム 2024</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
      </Head>
      <Hero />
      <div class="container mx-auto px-4">
        <ul class="flex flex-wrap justify-between mt-24">
          {candidates.map((candidate) => (
            <li>
              <Card
                id={candidate.id}
                label={candidate.name}
                image={candidate.image}
                csrfToken={csrfToken}
                voted={voted}
              />
            </li>
          ))}
        </ul>
      </div>
      <div class="mt-12 px-8">
        <hr />
        <h2 class="text-lg mt-12">以下テスト用</h2>
        <p class="mt-4 text-sm">60秒間に1回のみ投票可能です</p>
        <p class="mt-4 text-xl">
          {voted ? `❌ 投票済みです (${diff / 1000}秒前)` : "⭕️ 投票できます"}
        </p>
        <h3 class="mt-4 font-bold">投票結果</h3>
        <pre class="mt-2">{JSON.stringify(voteResults, null, 2)}</pre>
      </div>
    </>
  );
}
