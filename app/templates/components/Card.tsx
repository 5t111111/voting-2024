import type { FC } from "hono/jsx";
import { html } from "hono/html";
import { Button } from "./Button.tsx";

type Props = {
  id: string;
  label: string;
  image: string;
  csrfToken: string;
  voted: boolean;
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
        class="rounded-full w-64 h-64"
      />
      <p class="text-lg font-bold text-center mt-4">
        <span class="label">{label}</span>
      </p>
      {voted
        ? (
          <div class="text-center mt-4">
            <Button
              text="投票ありがとうございました"
              type="button"
              disabled={true}
            />
          </div>
        )
        : (
          <form
            action="/vote"
            method="post"
            onsubmit={`confirmVoting_${id}(event)`}
            class="text-center mt-4"
          >
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="_csrf" value={csrfToken} />
            <Button
              text="投票する"
              type="submit"
            />
          </form>
        )}
    </div>
  );
};
