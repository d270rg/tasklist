import z from "zod";

export const task = z.object({
  id: z.guid(),
  deadline: z.coerce.date(),
  title: z.string(),
  priority: z.int(),
  createdAt: z.coerce.date(),
  updatedAt: z.optional(z.coerce.date()),
});

export type Task = z.infer<typeof task>;
