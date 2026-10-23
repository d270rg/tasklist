import { TimeLeft } from "@/app/_widgets/timeLeft";
import { getById } from "@/app/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default async function Task({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = useQueryClient();
  const taskQuery = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getById(id),
  });
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["tasks", id] });
  }, [id]);

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
