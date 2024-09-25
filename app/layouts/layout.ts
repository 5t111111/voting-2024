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
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div class="container mx-auto px-4 pb-8 max-w-4xl">
          ${props.children}
        </div>
      </body>
    </html>
  `;
};
