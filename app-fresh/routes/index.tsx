import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "@std/http/cookie";

import { Card } from "../components/Card.tsx";
import { Hero } from "../components/Hero.tsx";
import { candidates } from "../data.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: FreshContext) {
    // 簡易 CSRF 対策のためのトークンをセッションにセット
    const csrfToken = Math.random().toString(36).slice(-8);
    const resp = await ctx.render({ csrfToken });
    setCookie(resp.headers, {
      name: "_csrf",
      value: csrfToken,
      maxAge: 120,
      sameSite: "Lax",
      path: "/",
      secure: true,
    });

    return resp;
  },
};

export default function Home({ data }: PageProps) {
  const csrfToken = data.csrfToken;
  const voted = false;

  return (
    <>
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
      {
        /* <div class={styles.testArea}>
        <hr class={styles.testAreaSeparator} />
        <h2 class={styles.testAreaHeader}>以下テスト用</h2>
        <p class={styles.testAreaPart}>60秒間に1回のみ投票可能です</p>
        <p class={styles.testAreaPart}>
          {voted ? `❌ 投票済みです ${diff / 1000}秒前` : "⭕️ 投票できます"}
        </p>
        <h3 class={styles.testAreaHeader}>投票結果</h3>
        <pre
          class={styles.testAreaPart}
        >{JSON.stringify(voteResults, null, 2)}</pre>
      </div> */
      }
    </>
  );
}
