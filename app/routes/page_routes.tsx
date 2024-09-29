import { Hono } from "hono";
import {
  type VoteRequest,
  voteRequestSchema,
} from "../schemas/vote_request.ts";
import { getAllItems, incrementCount } from "../database/kv.ts";
import { checkIfVoted } from "../utils/check_if_voted.ts";
import { Home } from "../pages/Home.tsx";
import { formDataToJson } from "../middlewares/formdata_to_json.ts";
import { checkCsrfToken, generateCsrfToken } from "../middlewares/csrf.ts";
import { GlobalAppContext } from "../app_factory.ts";

const app = new Hono<GlobalAppContext>();

/**
 * GET /
 * ホームページを表示する
 */
app.get("/", generateCsrfToken, async (c) => {
  const session = c.get("session");

  // -- テスト用
  const diff = new Date().getTime() - (session.get("voted_at") as number);
  const voteResults = await getAllItems();
  // --

  const voted = checkIfVoted(session.get("voted_at") as number);

  const csrfToken = c.var.csrfToken;

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
app.post("/vote", formDataToJson, checkCsrfToken, async (c) => {
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
