import { Suspense } from "react";
import { Expression, parseQuery, transformQueryToFilter } from "./queryParser";
import { Search } from "../_widgets/search";
import { TaskList } from "./TaskList";
import { useModal } from "../_store/Modal";
import Viewport from "./Viewport";

type SearchParams = { [key: string]: string | string[] | undefined };

// e.g. /?q=deadline:>0 title:='title'
function tryParseQueryFromSearchParams(
  searchParams: SearchParams,
): Expression[] | undefined {
  const query = searchParams.q;
  return typeof query === "string" ? parseQuery(query) : undefined;
}

export default async function Home({
  searchParams,
  params,
}: {
  searchParams: Promise<SearchParams>;
  params: Promise<{ page: string }>;
}) {
  const search = await searchParams;
  const page = (await params).page;
  const filter = transformQueryToFilter(tryParseQueryFromSearchParams(search));

  return <Viewport page={Number(page)} filter={filter}></Viewport>;
}

export const instant = false;
