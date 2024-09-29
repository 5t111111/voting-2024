import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { CookieStore, Session, sessionMiddleware } from "hono_sessions";

import adminApiRoutes from "./routes/admin_api_routes.ts";
import pageRoutes from "./routes/page_routes.tsx";

export type GlobalAppContext = {
  Variables: {
    session: Session;
    session_key_rotation: boolean;
  };
};

/**
 * Hono アプリケーションのインスタンスを生成する
 * @returns Hono アプリケーションのインスタンス
 */
export const buildApp = () => {
  const app = new Hono<GlobalAppContext>();

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
        secure: true,
      },
    }),
  );

  app.use("/static/*", serveStatic({ root: "./" }));

  app.route("/", pageRoutes);
  app.route("/api/admin", adminApiRoutes);

  return app;
};
