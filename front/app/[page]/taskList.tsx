"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FilterGroup } from "../_models/Query";
import { deleteTask, getPage, updateTask } from "../api";
import { useTaskPage } from "../_store/Pagination";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageNavigation } from "../_widgets/pageNav";
import { Task } from "../_models/Task";
import { EditModal } from "../_widgets/edit";

interface TaskListProps {
  filter: FilterGroup;
  activePage: number;
  pageSize: number;
}

export function TaskList({ filter, activePage, pageSize }: TaskListProps) {
  const queryClient = useQueryClient();
  const pagination = useTaskPage();

  const [modalData, setModalData] = useState<Task | undefined>(undefined);
  const [modalOpened, setModalOpened] = useState<boolean>(false);

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

  const editMutation = useMutation({
    mutationFn: (update: Task) => {
      let newTask = { ...update } as Partial<Task>;
      delete newTask.id;

      return updateTask(update.id, newTask);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks", filter, pagination],
      });
    },
  });

  return (
    <div className="w-100 d-flex justify-content-center">
      <div hidden={!modalOpened} className="position-absolute">
        <EditModal
          initialData={modalData}
          onSave={(task) => {
            editMutation.mutate(task);
            setModalOpened(false);
          }}
          onCancel={() => setModalOpened(false)}
        ></EditModal>
      </div>
      <div className="col col-sm-12 col-md-6">
        Tasks:
        {data?.values.map((task) => {
          return (
            <div key={task.id} className="p-2">
              <div className="d-flex flex-row justify-content-between">
                <div className="d-flex flex-column flex-grow-1">
                  <Link href={`/task/${task.id}`}>
                    <div>{task.title}</div>
                    <div>Deadline: {task.deadline.toLocaleString()}</div>
                  </Link>
                </div>

                <div className="d-flex flex-column">
                  <div className="d-flex flex-row">
                    <button
                      className="z-3"
                      onClick={() => deleteMutation.mutate(task.id)}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setModalData(task);
                        setModalOpened(true);
                      }}
                    >
                      Edit
                    </button>
                  </div>

                  <div>Priority: {task.priority}</div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="w-100 justify-content-center">
          <PageNavigation
            pageAmount={Math.ceil((data?.size ?? 0) / pageSize)}
            current={activePage}
          ></PageNavigation>
        </div>
      </div>
    </div>
  );
}
