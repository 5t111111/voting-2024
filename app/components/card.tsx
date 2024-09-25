import type { FC } from "hono/jsx";
import { html } from "hono/html";

type Props = {
  id: string;
  label: string;
  csrfToken: string;
  voted: boolean;
};

export const Card: FC<Props> = ({ id, label, csrfToken, voted }) => {
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
        src="https://placehold.co/400x400"
        alt={label}
        class="rounded-full h-64 w-64"
      />
      <p class="text-center mt-4 font-bold">
        <span class="label">{label}</span>
      </p>
      {voted
        ? (
          <div class="text-center mt-4">
            <button
              type="button"
              class="rounded-md bg-gray-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
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
            class="text-center mt-4"
          >
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="_csrf" value={csrfToken} />
            <button
              type="submit"
              class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              投票する
            </button>
          </form>
        )}
    </div>
  );
};
