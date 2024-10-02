import { FreshContext } from "$fresh/server.ts";
import { encodeBase64 } from "@std/encoding";
import { GlobalAppState } from "./_app.tsx";

export const handler = [
  /**
   * CSRF トークンを発行するミドルウェア
   */
  async function generateCsrfToken(
    _req: Request,
    ctx: FreshContext<GlobalAppState>,
  ) {
    const session = ctx.state.session;
    console.log("CSRF middle: state", ctx.state);
    console.log("CSRF middle: session", session);

    // 簡易 CSRF 対策のための CSRF トークンを発行してセッションにセット
    const csrfToken = encodeBase64(crypto.getRandomValues(new Uint8Array(32)));
    // session.set("csrf_token", csrfToken);

    // コンテキストのステートにも CSRF トークンをセットしてハンドラーに渡す
    ctx.state.csrfToken = csrfToken;

    // do something
    return await ctx.next();
  },
];
