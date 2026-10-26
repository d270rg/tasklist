"use client";

import { TimeLeft } from "@/app/_widgets/timeLeft";
import { getById } from "@/app/api";
import { useQuery } from "@tanstack/react-query";

export default async function Task({ id }: { id: string }) {
  const taskQuery = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getById(id),
  });

  return (
    <div>
      <div>{taskQuery.data?.title}</div>
      <div>Deadline: {taskQuery.data?.deadline.toISOString()}</div>
      <div>Priority: {taskQuery.data?.priority}</div>
      <div>
        Deadline:
        {taskQuery.data?.deadline && (
          <TimeLeft deadline={taskQuery.data.deadline} />
        )}
      </div>
      <div>Created: {taskQuery.data?.createdAt.toISOString()}</div>
      <div>Updated: {taskQuery.data?.updatedAt.toISOString()}</div>
    </div>
  );
}
