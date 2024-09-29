import { FreshContext } from "$fresh/server.ts";

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  const resp = await ctx.next();
  console.log("handler: ", req.url, resp.status);
  return resp;
}
