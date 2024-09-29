import { Hono } from "hono";
import {
  type VoteRequest,
  voteRequestSchema,
} from "../schemas/vote_request.ts";
import { getAllItems, incrementCount } from "../database/kv.ts";
import type { Application } from "../types/index.ts";
import { checkIfVoted } from "../utils/check_if_voted.ts";
import { Home } from "../pages/Home.tsx";
import { generateCsrfToken } from "../utils/csrf.ts";
import { formDataToJson } from "../middlewares/formdata_to_json.ts";
import { checkCsrf } from "../middlewares/check_csrf.ts";

const app = new Hono<Application>();

/**
 * GET /
 * ホームページを表示する
 */
app.get("/", async (c) => {
  const session = c.get("session");

  // -- テスト用
  const diff = new Date().getTime() - (session.get("voted_at") as number);
  const voteResults = await getAllItems();
  // --

  const voted = checkIfVoted(session.get("voted_at") as number);

  // 簡易 CSRF 対策のためのトークンをセッションにセット
  const csrfToken = generateCsrfToken();
  session.set("csrf_token", csrfToken);
  // console.log("csrf_token: GET", csrfToken);

  return c.render(
    <Home
      voted={voted}
      csrfToken={csrfToken}
      diff={diff}
      voteResults={voteResults}
    />,
  );
});

/**
 * POST /vote
 * 投票を行う
 */
app.post("/vote", formDataToJson, checkCsrf, async (c) => {
  let voteRequest: VoteRequest;

  try {
    voteRequest = voteRequestSchema.parse(c.var.inputData);
  } catch (error) {
    console.error(error);
    return new Response("Requested data is not valid.", {
      status: 400,
    });
  }

  const session = c.get("session");

  // 投票済みであれば投票できない
  // すでに UI 側でチェックしているのでここではシンプルに 403 を返す
  const voted = checkIfVoted(session.get("voted_at") as number);

  if (voted) {
    return new Response("You have already voted.", { status: 403 });
  }

  // 投票処理
  await incrementCount(voteRequest.id);

  // session の voted_at にタイムスタンプをセットする
  c.get("session").set("voted_at", new Date().getTime());

  return c.redirect("/", 302);
});

export default app;
