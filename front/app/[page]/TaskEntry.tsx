import Link from "next/link";
import { Task } from "../_models/Task";
import { UseMutationResult } from "@tanstack/react-query";

interface TaskEntryProps {
  task: Task;
  deleteMutation: UseMutationResult<any, any, any>;
  setModalData: (data: Task) => void;
  setModalOpened: (opened: boolean) => void;
}

export function TaskEntry({
  task,
  deleteMutation,
  setModalData,
  setModalOpened,
}: TaskEntryProps) {
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
}
