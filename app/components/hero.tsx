// @deno-types="../static/styled-system/css/index.d.mts"
import { css } from "../static/styled-system/css/index.mjs";

export const Hero = () => {
  return (
    <div
      class={css({
        bg: "indigo.800",
      })}
    >
      <div
        class={css({
          p: "4",
        })}
      >
        <h1
          class={css({
            fontSize: "4xl",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          })}
        >
          簡易投票システム 2024
        </h1>
        <p class={css({ textAlign: "center" })}>
          <a
            href="https://github.com/5t111111/voting-2024"
            target="_blank"
            rel="noreferrer"
            class={css({
              color: "white",
              textDecoration: "underline",
              _hover: {
                textDecoration: "none",
              },
            })}
          >
            https://github.com/5t111111/voting-2024
          </a>
        </p>
      </div>
    </div>
  );
};
