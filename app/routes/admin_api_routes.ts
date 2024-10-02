import { Hono } from "hono";
import { getAllItems } from "../database/kv.ts";

const app = new Hono();

app.get("/get-all-results", async () => {
  // return c.json({ message: "Voted successfully." });
  const items = await getAllItems();

  // Zapier の "Webhooks by Zapier" Action から扱いやすいような JSON のレイアウトにする
  const data = items.reduce((acc, item) => ({
    ...acc,
    [item.id]: item.count,
  }), {});

  return new Response(JSON.stringify(data));
});

export default app;
