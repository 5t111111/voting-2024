import { Hono } from "hono";
import { CookieStore, Session, sessionMiddleware } from "hono_sessions";

import adminApiRoutes from "./routes/admin_api_routes.ts";
import pageRoutes from "./routes/page_routes.tsx";
import { isProd } from "./utils/environments.ts";

/**
 * 必要な型情報を持つ最低限の Hono アプリケーションのインスタンスを生成する
 * @returns Hono アプリケーションのインスタンス
 */
export const buildMinimumApp = () => {
  return new Hono<{
    Variables: {
      session: Session;
      session_key_rotation: boolean;
    };
  }>();
};

/**
 * ミドルウェアなどを構成した、サーバー起動するための Hono アプリケーションのインスタンスを生成する
 * @returns Hono アプリケーションのインスタンス
 */
export const buildServerApp = () => {
  const app = buildMinimumApp();

  const store = new CookieStore();

  let sessionEncryptionKey = Deno.env.get("SESSION_ENCRYPTION_KEY");

  if (!sessionEncryptionKey) {
    // throw new Error("SESSION_ENCRYPTION_KEY is not set");
    sessionEncryptionKey = "very-very-very-very-very-very-very-very-secret";
  }

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
        secure: isProd(),
      },
    }),
  );

  app.route("/", pageRoutes);
  app.route("/api/admin", adminApiRoutes);

  return app;
};
