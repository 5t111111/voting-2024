import type { PageProps } from "$fresh/server.ts";
import { Session } from "@5t111111/fresh-session";

export interface GlobalAppState {
  session: Session;
  csrfToken: string | undefined;
}

export default function App({ Component }: PageProps) {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <head prefix="og: http://ogp.me/ns#" />
        <meta property="og:type" content="website" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/static/favicon.png" sizes="32x32" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
