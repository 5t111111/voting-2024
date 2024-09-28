// @deno-types="../static/styled-system/css/index.d.mts"
import { css } from "../static/styled-system/css/index.mjs";

const styles = {
  heroArea: css({
    bg: "indigo.800",
    p: 8,
  }),

  title: css({
    fontSize: "4xl",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  }),

  gitHubLinkParagraph: css({
    textAlign: "center",
  }),

  gitHubLink: css({
    color: "white",
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
  }),
};

export const Hero = () => {
  return (
    <div class={styles.heroArea}>
      <h1 class={styles.title}>
        簡易投票システム 2024
      </h1>
      <p class={styles.gitHubLinkParagraph}>
        <a
          href="https://github.com/5t111111/voting-2024"
          target="_blank"
          rel="noreferrer"
          class={styles.gitHubLink}
        >
          https://github.com/5t111111/voting-2024
        </a>
      </p>
    </div>
  );
};
