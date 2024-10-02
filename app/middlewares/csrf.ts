import { createMiddleware } from "hono/factory";
import { encodeBase64 } from "@std/encoding";
import z from "zod";
import { GlobalAppContext } from "../app_factory.ts";

/**
 * CSRF トークンを発行するミドルウェア
 */
export const generateCsrfToken = createMiddleware<
  GlobalAppContext & {
    Variables: {
      csrfToken: string;
    };
  }
>(async (c, next) => {
  const session = c.get("session");

  // 簡易 CSRF 対策のための CSRF トークンを発行してセッションにセット
  const csrfToken = encodeBase64(crypto.getRandomValues(new Uint8Array(32)));
  session.set("csrf_token", csrfToken);

  // コンテキスト変数にも CSRF トークンをセットしてハンドラーに渡す
  c.set("csrfToken", csrfToken);

  await next();
});

/**
 * CSRF トークンのリクエストスキーマ
 */
const csrfRequestSchema = z.object({
  _csrf: z.string(),
});

/**
 * CSRF トークンのリクエストデータ型
 */
type CsrfRequest = z.infer<typeof csrfRequestSchema>;

/**
 * CSRF トークンのチェックを行うミドルウェア
 * formDataToJson ミドルウェアに依存している
 */
export const checkCsrfToken = createMiddleware(async (c, next) => {
  let csrfRequest: CsrfRequest;

  try {
    csrfRequest = csrfRequestSchema.parse(c.var.inputData);
  } catch (error) {
    console.error(error);
    return new Response("Requested data is not valid.", {
      status: 400,
    });
  }

  const session = c.get("session");

  // CSRF トークンのチェック
  if (
    !session.get("csrf_token") ||
    csrfRequest._csrf !== session.get("csrf_token")
  ) {
    return new Response("CSRF token is invalid.", { status: 403 });
  }

  await next();
});
