import { FC } from "hono/jsx";
import { Layout } from "../layouts/layout.ts";
import { Hero } from "./hero.tsx";
import { Card } from "./card.tsx";
// @deno-types="../static/styled-system/css/index.d.mts"
import { css } from "../static/styled-system/css/index.mjs";
import { container } from "../static/styled-system/patterns/container.mjs";
import { Vote } from "../schemas/vote.ts";

const styles = {
  candidateList: css({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    mt: 24,
  }),

  testArea: css({
    mt: 24,
    p: 8,
  }),

  testAreaSeparator: css({
    mt: 12,
  }),

  testAreaHeader: css({
    mt: 12,
    fontWeight: "bold",
  }),

  testAreaPart: css({
    mt: 4,
  }),
};

type Props = {
  voted: boolean;
  csrfToken: string;
  diff: number;
  voteResults: Vote[];
};

export const HomePage: FC<Props> = (
  { voted, csrfToken, diff, voteResults },
) => {
  return (
    <Layout title="2024 投票ページ" description="2024年度版の投票ページです。">
      <Hero />
      <div class={container()}>
        <ul class={styles.candidateList}>
          <li>
            <Card
              id="salmon"
              label="サーモン"
              csrfToken={csrfToken}
              voted={voted}
            />
          </li>
          <li>
            <Card
              id="tuna"
              label="ツナ"
              csrfToken={csrfToken}
              voted={voted}
            />
          </li>
          <li>
            <Card
              id="trout"
              label="トラウト"
              csrfToken={csrfToken}
              voted={voted}
            />
          </li>
        </ul>
      </div>
      <div class={styles.testArea}>
        <hr class={styles.testAreaSeparator} />
        <h2 class={styles.testAreaHeader}>以下テスト用</h2>
        <p class={styles.testAreaPart}>60秒間に1回のみ投票可能です</p>
        <p class={styles.testAreaPart}>
          {voted ? `❌ 投票済みです ${diff / 1000}秒前` : "⭕️ 投票できます"}
        </p>
        <h3 class={styles.testAreaHeader}>投票結果</h3>
        <pre
          class={styles.testAreaPart}
        >{JSON.stringify(voteResults, null, 2)}</pre>
      </div>
    </Layout>
  );
};
