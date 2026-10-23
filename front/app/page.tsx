import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination, SortDirection } from "./_models/Query";
import { getPage } from "./api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface TaskListProps {
  paginationFilter: Pagination;
}
export function TaskList({ paginationFilter }: TaskListProps) {
  const router = useRouter();

  const queryClient = useQueryClient();
  const pageQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getPage(paginationFilter),
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  }, [paginationFilter]);

  return (
    <div>
      <ul>
        {pageQuery.data?.map((task) => {
          const timeLeft = Date.now() - task.deadline.getTime();
          return (
            <li key={task.id}>
              <button onClick={() => router.replace(`/task/${task.id}`)}>
                <div>{task.title}</div>
                <div>Deadline: {task.deadline.toISOString()}</div>
                <div>Priority: {task.priority}</div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Home() {
  const [paginationFilter, setPaginationFilter] = useState<Pagination>({
    sort: { field: "createdAt", direction: SortDirection.Asc },
    start: 0,
    limit: -1,
  });

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <TaskList paginationFilter={paginationFilter}></TaskList>
      </main>
    </div>
  );
}
