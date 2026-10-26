"use client";

import { useQuery } from "@tanstack/react-query";
import { FilterGroup } from "./_models/Query";
import { getPage } from "./api";
import { useRouter } from "next/navigation";
import { useTaskPage } from "./_store/Pagination";

interface TaskListProps {
  filter: FilterGroup;
}
export function TaskList({ filter }: TaskListProps) {
  const router = useRouter();

  const pagination = useTaskPage();

  const { data, isPending } = useQuery({
    queryKey: ["tasks", filter],
    queryFn: () => getPage({ pagination: { filter, ...pagination } }),
  });
  console.log(data);
  return (
    <div>
      Tasks:
      <ul>
        {data?.map((task) => {
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
