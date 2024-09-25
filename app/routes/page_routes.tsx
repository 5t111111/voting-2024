import { Hono } from "hono";
import { html } from "hono/html";
import {
  type VoteRequest,
  voteRequestSchema,
} from "../schemas/vote_request.ts";
import { getAllItems, incrementCount } from "../database/kv.ts";
import type { Application } from "../types/index.ts";
import { checkIfVoted } from "../utils/check_if_voted.ts";
import { Hero } from "../components/hero.tsx";

const app = new Hono<Application>();

interface SiteData {
  title: string;
  description: string;
  // deno-lint-ignore no-explicit-any
  children?: any;
}

function Layout(props: SiteData) {
  return html`
    <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>${props.title}</title>
        <meta name="description" content="${props.description}">
        <head prefix="og: http://ogp.me/ns#">
        <meta property="og:type" content="website">
        <meta property="og:title" content="${props.title}">
        <!-- <meta property="og:image" content="dummy"> -->
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div class="container mx-auto px-4 pb-8 max-w-4xl">
          ${props.children}
        </div>
      </body>
    </html>
  `;
}

function createForm(
  id: string,
  label: string,
  csrfToken: string,
  voted: boolean,
) {
  return (
    <>
      <img
        src="https://placehold.co/400x400"
        alt={label}
        class="rounded-full h-64 w-64"
      />
      <p class="text-center mt-4 font-bold">
        <span class="label">{label}</span>
      </p>
      {voted
        ? (
          <div class="text-center mt-4">
            <button
              type="button"
              class="rounded-md bg-gray-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              投票ありがとうございました
            </button>
          </div>
        )
        : (
          <form
            action="/vote"
            method="post"
            onsubmit="confirmVoting(event)"
            class="text-center mt-4"
          >
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="_csrf" value={csrfToken} />
            <button
              type="submit"
              class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              投票する
            </button>
          </form>
        )}
    </>
  );
}

app.get("/", async (c) => {
  const session = c.get("session");

  // テスト用
  const diff = new Date().getTime() - (session.get("voted_at") as number);

  const voted = checkIfVoted(session.get("voted_at") as number);

  const voteResults = await getAllItems();

  // 簡易 CSRF 対策のためのトークンをセッションにセット
  const csrfToken = Math.random().toString(36).slice(-8);
  session.set("csrf_token", csrfToken);
  // console.log("csrf_token: GET", csrfToken);

  return c.render(
    <Layout title="2024 投票ページ" description="2024年度版の投票ページです。">
      <Hero />
      {html`
        <script>
          function confirmVoting(event) {
            event.preventDefault();
            const form = event.target;
            const spanElement = form.previousElementSibling.querySelector('.label');
            const name = spanElement.textContent;

            if (window.confirm(name + 'に投票します。よろしいですか？')) {
              form.submit();
            }
          }
        </script>
      `}
      <ul class="flex flex-wrap justify-between mt-16">
        <li>{createForm("salmon", "サーモン", csrfToken, voted)}</li>
        <li>{createForm("tuna", "ツナ", csrfToken, voted)}</li>
        <li>{createForm("trout", "トラウト", csrfToken, voted)}</li>
      </ul>
      <hr class="mt-12" />
      <h2 class="text-lg mt-12">以下テスト用</h2>
      <p class="mt-4 text-sm">60秒間に1回のみ投票可能です</p>
      <p class="mt-4">
        {voted ? `❌ 投票済みです ${diff / 1000}秒前` : "⭕️ 投票できます"}
      </p>
      <h3 class="mt-4 font-bold">投票結果</h3>
      <pre class="mt-2">{JSON.stringify(voteResults, null, 2)}</pre>
    </Layout>,
  );
});

app.post("/vote", async (c) => {
  const session = c.get("session");

  // 投票済みであれば投票できない
  // すでに UI 側でチェックしているのでここではシンプルに 403 を返す
  const voted = checkIfVoted(session.get("voted_at") as number);
  if (voted) {
    return new Response("You have already voted.", { status: 403 });
  }

  let voteRequest: VoteRequest;

  try {
    const formData = await c.req.formData();
    // const data = await c.req.json();
    // console.log(formData);
    voteRequest = voteRequestSchema.parse(
      // FormData からオブジェクトに変換する
      Object.fromEntries(formData.entries()),
    );
  } catch (_error) {
    console.error(_error);
    return new Response("Requested JSON is not valid.", {
      status: 400,
    });
  }

  // console.log("csrf_token: IN FORMDATA:", voteRequest._csrf);
  // console.log("csrf_token: IN SESSION :", session.get("csrf_token"));

  // CSRF トークンのチェック
  if (
    !session.get("csrf_token") ||
    voteRequest._csrf !== session.get("csrf_token")
  ) {
    return new Response("CSRF token is invalid.", { status: 403 });
  }

  // 投票処理
  await incrementCount(voteRequest.id.toString());

  // session の voted_at にタイムスタンプをセットする
  c.get("session").set("voted_at", new Date().getTime());

  return c.redirect("/", 302);
});

export default app;
