import { Handlers } from "$fresh/server.ts";
import { incrementCount } from "../../database/kv.ts";
import { VoteRequest, voteRequestSchema } from "../../schemas/vote_request.ts";
import { checkIfVoted } from "../../utils/check_if_voted.ts";
import { GlobalAppState } from "../_app.tsx";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, GlobalAppState> = {
  async POST(req, ctx) {
    // const session = c.get("session");

    // 投票済みであれば投票できない
    // すでに UI 側でチェックしているのでここではシンプルに 403 を返す
    const session = ctx.state.session;
    const voted = checkIfVoted(session.get("voted_at") as number);

    if (voted) {
      return new Response("You have already voted.", { status: 403 });
    }

    let voteRequest: VoteRequest;

    try {
      const data = await req.json();
      console.log("data: ", data);
      voteRequest = voteRequestSchema.parse(data);
    } catch (error) {
      console.error(error);
      return new Response("Requested JSON is not valid.", {
        status: 400,
      });
    }

    // console.log("csrf_token: IN REQURST:", voteRequest._csrf);
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
    session.set("voted_at", new Date().getTime());

    return new Response(JSON.stringify({ status: "success" }), {
      status: 200,
    });
  },
};
