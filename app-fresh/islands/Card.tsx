import { FunctionComponent } from "preact";
import { useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";

type Props = {
  id: string;
  label: string;
  image: string;
  csrfToken: string;
  voted: boolean;
};

export const Card: FunctionComponent<Props> = (
  { id, label, image, csrfToken, voted },
) => {
  const submitted = useSignal(voted);
  console.log("voted", voted);
  console.log("submitted.value", submitted.value);

  const onClickVoteButton = async (id: string) => {
    if (!globalThis.confirm(`${label}に投票します。よろしいですか？`)) {
      return;
    }

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, _csrf: csrfToken }),
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }

    submitted.value = true;
  };

  return (
    <div>
      <img
        src={image}
        alt={label}
        class="rounded-full w-64 h-64"
      />
      <p class="text-lg font-bold text-center mt-4">
        <span class="label">{label}</span>
      </p>
      {voted || submitted.value
        ? (
          <div class="text-center mt-4">
            <Button
              text="投票ありがとうございました"
              disabled={true}
            />
          </div>
        )
        : (
          <div class="text-center mt-4">
            <input type="hidden" name="id" value={id} />
            <Button
              text="投票する"
              onClick={() => {
                onClickVoteButton(id);
              }}
            />
          </div>
        )}
    </div>
  );
};
