import { Card } from "../components/Card.tsx";
import { Hero } from "../components/Hero.tsx";
import { data } from "../data.ts";

export default function Home() {
  const csrfToken = "test";
  const voted = false;

  return (
    <>
      <Hero />
      <div class="container mx-auto px-4">
        <ul class="flex flex-wrap justify-between mt-24">
          {data.map((item) => (
            <li>
              <Card
                id={item.id}
                label={item.name}
                image={item.image}
                csrfToken={csrfToken}
                voted={voted}
              />
            </li>
          ))}
        </ul>
      </div>
      {
        /* <div class={styles.testArea}>
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
      </div> */
      }
    </>
  );
}
