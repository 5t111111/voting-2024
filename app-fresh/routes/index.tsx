import { Handlers, PageProps } from "$fresh/server.ts";

import { Hero } from "../components/Hero.tsx";
import { Head } from "$fresh/runtime.ts";
import { GlobalAppState } from "./_app.tsx";
import { encodeBase64 } from "@std/encoding";
import { checkIfVoted } from "../utils/check_if_voted.ts";
import { CandidateList } from "../islands/CandidateList.tsx";
import { getAllItems } from "../database/kv.ts";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { DevPanel } from "../islands/DevPanel.tsx";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, GlobalAppState> = {
  async GET(_req, ctx) {
    const session = ctx.state.session;

    // -- テスト用
    const votedAt = session.get("voted_at") as number | undefined;
    const diff = new Date().getTime() - (votedAt || 0);
    const voteResults = await getAllItems();
    // --

    // 投票済みかどうかを判定
    const voted = checkIfVoted(session.get("voted_at") as number | undefined);

    // 簡易 CSRF 対策のための CSRF トークンを発行してセッションにセット
    const csrfToken = encodeBase64(crypto.getRandomValues(new Uint8Array(32)));
    session.set("csrf_token", csrfToken);

    const resp = await ctx.render({ voted, csrfToken, diff, voteResults });

    return resp;
  },
};

export default function Home({ data }: PageProps) {
  const title = "トップ";
  const description = "2024年度版の投票ページです。";

  const { voted, csrfToken, diff, voteResults } = data;

  const submittedSignal = useSignal(voted);

  return (
    <>
      <Head>
        <title>{title} | 簡易投票システム 2024</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
      </Head>
      <Hero />
      <div class="container mx-auto px-4">
        <CandidateList
          csrfToken={csrfToken}
          submittedSignal={submittedSignal}
        />
      </div>
      <DevPanel
        diff={diff}
        voteResults={voteResults}
        submittedSignal={submittedSignal}
      />
    </>
  );
}
