import { createMiddleware } from "hono/factory";

const adminApiKey = Deno.env.get("ADMIN_API_KEY");

if (!adminApiKey) {
  throw new Error("ADMIN_API_KEY is not set");
}

/**
 * 保護された管理用 API の認証を行うミドルウェア
 */
export const adminApiAuth = createMiddleware(async (c, next) => {
  const authorization = c.req.header("authorization");

  if (!authorization) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const apiKey = authorization.replace("Bearer ", "");

  if (apiKey !== adminApiKey) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  await next();
});
