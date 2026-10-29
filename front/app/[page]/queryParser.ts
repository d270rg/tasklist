import {
  FilterGroup,
  FilterOptions,
  Junction,
  OpExpression,
} from "../_models/Query";
import { task } from "../_models/Task";

const defaultSearchField = "title";
type Op = "=" | "!=" | ">" | ">=" | "<" | "<=";
const ops: Op[] = ["=", ">=", "<=", ">", "<", "!="];

export interface Expression {
  key: string;
  op: Op;
  value: string;
}

function isOp(op: string): op is Op {
  return ops.includes(op as Op);
}

export function parseQuery(searchParams: string): Expression[] {
  let terms = searchParams.split(" ");

  if (terms === undefined) {
    return [];
  }

  let parsedTerms: Expression[] = [];
  for (const term of terms) {
    const splitTerm = term.split(":");
    if (splitTerm.length === 1) {
      parsedTerms.push({
        key: defaultSearchField,
        op: "=",
        value: splitTerm[0],
      });
    } else {
      const key = splitTerm[0];
      const opAndValue = splitTerm[1];

      for (const possibleOp of ops) {
        const parsed = opAndValue.split(possibleOp);

        if (parsed.length > 1) {
          parsedTerms.push({
            key,
            op: possibleOp,
            value: parsed[1],
          });
          break;
        }
      }
    }
  }

  return parsedTerms;
}

function expressionToFilterOptions(
  expr: Expression,
): FilterOptions | undefined {
  const field = task.keyof().safeParse(expr.key);
  if (field.error) {
    return undefined;
  }

  let op: OpExpression;
  switch (expr.op) {
    case "=":
      op = OpExpression.Equals;
      break;
    case "!=":
      op = OpExpression.NotEquals;
      break;
    case "<":
      op = OpExpression.LessThan;
      break;
    case ">":
      op = OpExpression.GreaterThan;
      break;
    case "<=":
      op = OpExpression.LessThenOrEqual;
      break;
    case ">=":
      op = OpExpression.GreaterThanOrEqual;
      break;
    default:
      return undefined;
  }

  return {
    field: field.data,
    op,
    value: expr.value,
  };
}

export function transformQueryToFilter(exprs: Expression[] = []): FilterGroup {
  const filter: FilterGroup = {
    junction: Junction.And,
    terms: [],
  };

  for (const expr of exprs) {
    const filterOptions = expressionToFilterOptions(expr);
    if (filterOptions === undefined) {
      continue;
    }

    filter.terms.push({ options: filterOptions });
  }

  return filter;
}
