"use client";

import { useQuery } from "@tanstack/react-query";
import { FilterGroup } from "./_models/Query";
import { getPage } from "./api";
import { useTaskPage } from "./_store/Pagination";
import Link from "next/link";

interface TaskListProps {
  filter: FilterGroup;
}

export function TaskList({ filter }: TaskListProps) {
  const pagination = useTaskPage();

  const { data, isPending } = useQuery({
    queryKey: ["tasks", filter],
    queryFn: () => getPage({ filter, ...pagination }),
  });

  return (
    <div>
      Tasks:
      <ul>
        {data?.map((task) => {
          return (
            <li key={task.id}>
              <Link href={`/task/${task.id}`}>
                <div>{task.title}</div>
                <div>Deadline: {task.deadline.toISOString()}</div>
                <div>Priority: {task.priority}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
