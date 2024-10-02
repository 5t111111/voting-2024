import { FC } from "hono/jsx";

interface Props {
  title: string;
  description: string;
  // deno-lint-ignore no-explicit-any
  children: any;
}

export const Layout: FC<Props> = ({ title, description, children }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <title>{title} | 簡易投票システム 2024</title>
        <meta name="description" content={description} />
        <head prefix="og: http://ogp.me/ns#" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        {
          /* <meta property="og:image" content="dummy"> */
        }
        <link rel="stylesheet" href="/static/styles.css" />
        <link rel="icon" href="/static/favicon.png" sizes="32x32" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};
