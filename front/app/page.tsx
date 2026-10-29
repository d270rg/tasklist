import { Suspense } from "react";
import { TaskList } from "./taskList";
import { Expression, parseQuery, transformQueryToFilter } from "./queryParser";
import { Search } from "./_widgets/search";

type SearchParams = { [key: string]: string | string[] | undefined };

// e.g. /?q=deadline:>0 title:='title'
function tryParseQueryFromSearchParams(
  searchParams: SearchParams,
): Expression[] | undefined {
  const query = searchParams.q;
  return typeof query === "string" ? parseQuery(query) : undefined;
}

async function FilteredTaskList({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filter = transformQueryToFilter(tryParseQueryFromSearchParams(params));

  return <TaskList filter={filter} />;
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Suspense fallback={<p>Loading...</p>}>
          <Search />
        </Suspense>
        <Suspense fallback={<p>Loading tasks…</p>}>
          <FilteredTaskList searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}
