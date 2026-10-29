"use client";

import { useQuery } from "@tanstack/react-query";
import { FilterGroup } from "../_models/Query";
import { getPage } from "../api";
import { useTaskPage } from "../_store/Pagination";
import Link from "next/link";
import { useEffect } from "react";
import { PageNavigation } from "../_widgets/pageNav";

interface TaskListProps {
  filter: FilterGroup;
  activePage: number;
  pageSize: number;
}

export function TaskList({ filter, activePage, pageSize }: TaskListProps) {
  const pagination = useTaskPage();
  useEffect(() => {
    pagination.setLimits(
      pageSize * (activePage - 1),
      pageSize * (activePage - 1) + pageSize,
    );
  }, [activePage]);

  const { data, isPending } = useQuery({
    queryKey: ["tasks", filter, pagination],
    queryFn: () => {
      return getPage({ filter, ...pagination });
    },
  });

  return (
    <div>
      Tasks:
      <ul>
        {data?.values.map((task) => {
          return (
            <li key={task.id} className="p-2">
              <Link href={`/task/${task.id}`}>
                <div>{task.title}</div>
                <div>Deadline: {task.deadline.toISOString()}</div>
                <div>Priority: {task.priority}</div>
              </Link>
            </li>
          );
        })}
      </ul>
      <PageNavigation
        pageAmount={Math.ceil((data?.size ?? 0) / pageSize)}
        current={activePage}
      ></PageNavigation>
    </div>
  );
}
