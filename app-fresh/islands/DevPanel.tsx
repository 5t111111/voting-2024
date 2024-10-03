import { FunctionComponent } from "preact";
import { Signal } from "@preact/signals";
import { Vote } from "../schemas/vote.ts";

interface Props {
  diff: number;
  voteResults: Vote[];
  submittedSignal: Signal<boolean>;
}

export const DevPanel: FunctionComponent<Props> = (
  { diff, voteResults, submittedSignal },
) => {
  return (
    <div class="mt-12 px-8">
      <hr />
      <h2 class="text-lg mt-12">以下テスト用</h2>
      <p class="mt-4 text-sm">60秒間に1回のみ投票可能です</p>
      <p class="mt-4 text-xl">
        {submittedSignal.value
          ? `❌ 投票済みです (${diff / 1000}秒前)`
          : "⭕️ 投票できます"}
      </p>
      <h3 class="mt-4 font-bold">投票結果</h3>
      <pre class="mt-2">{JSON.stringify(voteResults, null, 2)}</pre>
    </div>
  );
};
