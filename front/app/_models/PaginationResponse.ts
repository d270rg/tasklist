import z from "zod";
import { task } from "./Task";

export const paginationResponse = z.object({
  values: z.array(task),
  size: z.int(),
});

export type PaginationResponse = z.infer<typeof paginationResponse>;
