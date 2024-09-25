import z from "zod";
import { voteSchema } from "./vote.ts";

export const voteRequestSchema = voteSchema.pick({ id: true }).merge(z.object({
  _csrf: z.string(),
}));

export type VoteRequest = z.infer<typeof voteRequestSchema>;
