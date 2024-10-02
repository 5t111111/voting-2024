import { FC } from "hono/jsx";
import { Vote } from "../../schemas/vote.ts";
import { data } from "../../data.ts";
import { Hero } from "../components/Hero.tsx";
import { Card } from "../components/Card.tsx";
import { Layout } from "../layouts/Layout.tsx";

type Props = {
  voted: boolean;
  csrfToken: string;
  diff: number;
  voteResults: Vote[];
};

export const Home: FC<Props> = (
  { voted, csrfToken, diff, voteResults },
) => {
  return (
    <Layout title="2024 投票ページ" description="2024年度版の投票ページです。">
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
      <div class="mt-12 px-8">
        <hr />
        <h2 class="text-lg mt-12">以下テスト用</h2>
        <p class="mt-4 text-sm">60秒間に1回のみ投票可能です</p>
        <p class="mt-4 text-xl">
          {voted ? `❌ 投票済みです (${diff / 1000}秒前)` : "⭕️ 投票できます"}
        </p>
        <h3 class="mt-4 font-bold">投票結果</h3>
        <pre class="mt-2">{JSON.stringify(voteResults, null, 2)}</pre>
      </div>
    </Layout>
  );
};
