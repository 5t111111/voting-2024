import { Hono } from "hono";
import { html } from "hono/html";
import {
  type VoteRequest,
  voteRequestSchema,
} from "../schemas/vote_request.ts";
import { getAllItems, incrementCount } from "../database/kv.ts";
import type { Application } from "../types/index.ts";

const app = new Hono<Application>();

function checkIfVoted(votedAt: number | undefined): boolean {
  // 投票していない場合は false を返す
  if (!votedAt) {
    return false;
  }

  // 現在時刻のタイムスタンプとの差分を取得する
  const diff = new Date().getTime() - votedAt;

  // 1分以内に投票していたら投票済みとみなす
  // return diff < 60000;
  return diff < 10000;
}

function createForm(
  id: string,
  label: string,
  csrfToken: string,
  voted: boolean,
) {
  return (
    <>
      <p>
        <span>{label}</span>に投票する
      </p>
      {voted ? <p>投票済み</p> : html`
        <form action="/vote" method="post" onSubmit=check>
          <input type="hidden" name="id" value="${id}" />
          <input type="hidden" name="_csrf" value=${csrfToken} />
          <button type="submit">投票</button>
        </form>`}
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
  console.log("csrf_token", csrfToken);

  return c.render(
    <>
      <h1>2024 投票ページ</h1>
      {html`
        <script>
          function check(event) {
            const form = event.target;
            const spanElement = form.previousElementSibling.querySelector('span');

            const name = spanElement.textContent;

            if (window.confirm(name + 'に投票します。よろしいですか？')) {
              return true;
            } else {
              return false;
            }
          }
        </script>
      `}
      <ul>
        <li>{createForm("salmon", "サーモン", csrfToken, voted)}</li>
        <li>{createForm("tuna", "ツナ", csrfToken, voted)}</li>
        <li>{createForm("trout", "トラウト", csrfToken, voted)}</li>
      </ul>
      <h2>以下テスト用</h2>
      <p>10秒間に1回のみ投票可能です</p>
      <p>{voted ? `投票済みです ${diff / 1000}秒前` : "投票できます"}</p>
      <h3>結果</h3>
      <p>{JSON.stringify(voteResults, null, 2)}</p>
    </>,
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
    console.log(formData);
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
