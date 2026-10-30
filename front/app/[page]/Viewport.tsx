"use client";

import { Suspense } from "react";
import { Search } from "../_widgets/search";
import { TaskList } from "./TaskList";
import { FilterGroup } from "../_models/Query";
import { Mode, useModal } from "../_store/Modal";
import { EditModal } from "../_widgets/edit";
import { useTaskPage } from "../_store/Pagination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "../_models/Task";
import { addTask, updateTask } from "../api";
import "./Viewport.css";

export default function Viewport({
  filter,
  page,
}: {
  filter: FilterGroup;
  page: number;
}) {
  const queryClient = useQueryClient();
  const modalState = useModal();
  const pagination = useTaskPage();

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

  const createMutation = useMutation({
    mutationFn: (newTask: Task) => addTask(newTask),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks", filter, pagination],
      });
    },
  });

  return (
    <div className="h-100 d-flex flex-column align-items-center justify-content-stretch p-3">
      <div className="d-flex flex-row mb-4">
        <Suspense fallback={<p>Loading...</p>}>
          <Search />
        </Suspense>
        <button
          className="ms-1 btn bg-2 text-light"
          onClick={() => {
            modalState.setMode(Mode.Create);
            modalState.setModalData(undefined);
            modalState.setOpened(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-plus-lg"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
            />
          </svg>
        </button>
      </div>
      <Suspense fallback={<p>Loading tasks…</p>}>
        <TaskList filter={filter} activePage={page} pageSize={10} />
      </Suspense>

      <div hidden={!modalState.modalOpened} className="modal-container">
        <div className="modal-body bg-1 text-light p-3 rounded">
          <EditModal
            initialData={modalState.modalData}
            onSave={(task) => {
              if (modalState.mode === Mode.Edit) {
                editMutation.mutate(task);
              }

              if (modalState.mode === Mode.Create) {
                createMutation.mutate(task);
              }

              modalState.setOpened(false);
            }}
            onCancel={() => {
              modalState.setOpened(false);
              modalState.setModalData(undefined);
            }}
          ></EditModal>
        </div>
      </div>
    </div>
  );
}
