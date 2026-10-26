import z from "zod";
import { task } from "./Task";

export enum Junction {
  And = "And",
  Or = "Or",
}

export enum OpExpression {
  NotEquals = "ne",
  Equals = "eq",
  GreaterThan = "gt",
  LessThan = "lt",
  GreaterThanOrEqual = "gte",
  LessThenOrEqual = "lte",
}

export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

const filterGroup = z.object({
  junction: z.enum(Junction),
  get terms() {
    return z.array(filterNode);
  },
});
export type FilterGroup = z.infer<typeof filterGroup>;

const filterOptions = z.object({
  field: z.keyof(task),
  op: z.enum(OpExpression),
  value: z.unknown(),
});
export type FilterOptions = z.infer<typeof filterOptions>;

const filterNode = z.object({
  get group() {
    return z.optional(filterGroup);
  },
  options: z.optional(filterOptions),
});

export const sort = z.object({
  field: z.keyof(task),
  direction: z.enum(SortDirection),
});
export type Sort = z.infer<typeof sort>;

export const pagination = z.object({
  filter: z.optional(filterGroup),
  sort: z.optional(sort),
  start: z.number(),
  limit: z.number(),
});
export type Pagination = z.infer<typeof pagination>;
