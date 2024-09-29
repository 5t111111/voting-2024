import { createMiddleware } from "hono/factory";
import z from "zod";

const csrfRequestSchema = z.object({
  _csrf: z.string(),
});

type CsrfRequest = z.infer<typeof csrfRequestSchema>;

/**
 * CSRF トークンのチェックを行うミドルウェア
 */
export const checkCsrf = createMiddleware(async (c, next) => {
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
