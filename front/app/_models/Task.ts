import z from "zod";

export const task = z.object({
  id: z.guid(),
  deadline: z.date(),
  title: z.string(),
  priority: z.int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Task = z.infer<typeof task>;
