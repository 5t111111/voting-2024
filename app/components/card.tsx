import type { FC } from "hono/jsx";
import { html } from "hono/html";

// @deno-types="../static/styled-system/css/index.d.mts"
import { css } from "../static/styled-system/css/index.mjs";

type Props = {
  id: string;
  label: string;
  image: string;
  csrfToken: string;
  voted: boolean;
};

const buttonStyle = {
  rounded: "lg",
  px: 3,
  py: 2,
  fontWeight: "semibold",
  color: "white",
  shadow: "sm",
};

const styles = {
  avatarIcon: css({
    rounded: "full",
    h: 64,
    w: 64,
  }),

  name: css({
    fontSize: "lg",
    fontWeight: "bold",
    textAlign: "center",
    mt: 4,
  }),

  voteButtonArea: css({
    textAlign: "center",
    mt: 4,
  }),

  disabledVoteButton: css(buttonStyle, {
    bg: "gray.400",
  }),

  voteButton: css(buttonStyle, {
    cursor: "pointer",
    bg: "indigo.600",
    _hover: {
      bg: "indigo.500",
    },
  }),
};

export const Card: FC<Props> = ({ id, label, image, csrfToken, voted }) => {
  return (
    <div>
      {html`
        <script>
          function confirmVoting_${id}(event) {
            event.preventDefault();
            const form = event.target;

            if (window.confirm("${label}に投票します。よろしいですか？")) {
              form.submit();
            }
          }
        </script>
      `}
      <img
        src={image}
        alt={label}
        class={styles.avatarIcon}
      />
      <p class={styles.name}>
        <span class="label">{label}</span>
      </p>
      {voted
        ? (
          <div class={styles.voteButtonArea}>
            <button
              type="button"
              class={styles.disabledVoteButton}
              disabled
            >
              投票ありがとうございました
            </button>
          </div>
        )
        : (
          <form
            action="/vote"
            method="post"
            onsubmit={`confirmVoting_${id}(event)`}
            class={styles.voteButtonArea}
          >
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="_csrf" value={csrfToken} />
            <button
              type="submit"
              class={styles.voteButton}
            >
              投票する
            </button>
          </form>
        )}
    </div>
  );
};
