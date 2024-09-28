import { html } from "hono/html";

interface SiteData {
  title: string;
  description: string;
  // deno-lint-ignore no-explicit-any
  children?: any;
}

export const Layout = (props: SiteData) => {
  return html`
    <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>${props.title}</title>
        <meta name="description" content="${props.description}">
        <head prefix="og: http://ogp.me/ns#">
        <meta property="og:type" content="website">
        <meta property="og:title" content="${props.title}">
        <!-- <meta property="og:image" content="dummy"> -->
        <link rel="stylesheet" href="/static/styled-system/styles.css" />
        <link rel="icon" href="/static/favicon.png" sizes="32x32">
      </head>
      <body>
        ${props.children}
      </body>
    </html>
  `;
};
