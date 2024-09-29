import z from "zod";
import { voteSchema } from "./vote.ts";

export const voteRequestSchema = voteSchema.pick({ id: true });

export type VoteRequest = z.infer<typeof voteRequestSchema>;
