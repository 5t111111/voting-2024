import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { CookieStore, Session, sessionMiddleware } from "hono_sessions";

import adminApiRoutes from "./routes/admin_api_routes.ts";
import pageRoutes from "./routes/page_routes.tsx";
import { adminApiAuth } from "./middlewares/admin_api_auth.ts";

export type GlobalAppContext = {
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
};

const sessionEncryptionKey = Deno.env.get("SESSION_ENCRYPTION_KEY");

if (!sessionEncryptionKey) {
  throw new Error("SESSION_ENCRYPTION_KEY is not set");
}

/**
 * Hono アプリケーションのインスタンスを生成する
 * @returns Hono アプリケーションのインスタンス
 */
export const buildApp = () => {
  const app = new Hono<GlobalAppContext>();

  const store = new CookieStore();

  app.use(
    "*",
    // @ts-ignore https://github.com/jcs224/hono_sessions?tab=readme-ov-file#typescript-errors
    sessionMiddleware({
      store,
      encryptionKey: sessionEncryptionKey,
      expireAfterSeconds: 1440,
      cookieOptions: {
        sameSite: "Lax",
        path: "/",
        httpOnly: true,
        maxAge: 1440,
        secure: true,
      },
    }),
  );

  app.use("/static/*", serveStatic({ root: "./" }));

  app.route("/", pageRoutes);

  app.use("/api/admin/*", adminApiAuth);
  app.route("/api/admin", adminApiRoutes);

  return app;
};
