"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FilterGroup } from "../_models/Query";
import { deleteTask, getPage, updateTask } from "../api";
import { useTaskPage } from "../_store/Pagination";
import { useEffect, useState } from "react";
import { PageNavigation } from "../_widgets/pageNav";
import { Task } from "../_models/Task";
import { EditModal } from "../_widgets/edit";
import { TaskEntry } from "./TaskEntry";
import "./TaskList.css";
import { useModal } from "../_store/Modal";

interface TaskListProps {
  filter: FilterGroup;
  activePage: number;
  pageSize: number;
}

export function TaskList({ filter, activePage, pageSize }: TaskListProps) {
  const queryClient = useQueryClient();
  const pagination = useTaskPage();

  useEffect(() => {
    pagination.setLimits(
      pageSize * (activePage - 1),
      pageSize * (activePage - 1) + pageSize,
    );
  }, [activePage]);

  const { data } = useQuery({
    queryKey: ["tasks", filter, pagination],
    queryFn: () => {
      return getPage({ filter, ...pagination });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteTask(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks", filter, pagination],
      });
    },
  });

  return (
    <div className="w-100 h-100 d-flex justify-content-center">
      <div className="col col-sm-12 col-md-6">
        <div>
          {data?.values.map((task) => {
            return (
              <TaskEntry
                task={task}
                deleteMutation={deleteMutation}
              ></TaskEntry>
            );
          })}
        </div>
        <div className="w-100 mt-4 justify-content-center">
          <PageNavigation
            pageAmount={Math.ceil((data?.size ?? 0) / pageSize)}
            current={activePage}
          ></PageNavigation>
        </div>
      </div>
    </div>
  );
}
