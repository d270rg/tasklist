import { Suspense, createElement } from "react";
import { TaskList } from "./taskList";
import { Expression, parseQuery, transformQueryToFilter } from "./queryParser";
import { Search } from "../_widgets/search";

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

  return (
    <div className="wv-100 d-flex flex-column align-items-center p-3">
      <div className="d-flex flex-row">
        <Suspense fallback={<p>Loading...</p>}>
          <Search />
        </Suspense>
        <button className="ms-1">Add</button>
      </div>
      <Suspense fallback={<p>Loading tasks…</p>}>
        <TaskList filter={filter} activePage={Number(page)} pageSize={10} />
      </Suspense>
    </div>
  );
}

export const instant = false;
