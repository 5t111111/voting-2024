import z from "zod";

export const voteSchema = z.object({
  id: z.enum(["salmon", "tuna", "trout"]),
  count: z.number(),
});

export type Vote = z.infer<typeof voteSchema>;
