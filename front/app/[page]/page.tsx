import { Suspense } from "react";
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
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Suspense fallback={<p>Loading...</p>}>
          <Search />
        </Suspense>
        <Suspense fallback={<p>Loading tasks…</p>}>
          <TaskList filter={filter} activePage={Number(page)} pageSize={10} />
        </Suspense>
      </main>
    </div>
  );
}

export const instant = false;
