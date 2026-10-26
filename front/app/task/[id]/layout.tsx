import { Suspense } from "react";
import Task from "./page";

async function TaskWithParams({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Task id={id} />;
}

export default function TaskLayout({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p>Loading task…</p>}>
      <TaskWithParams params={params} />
    </Suspense>
  );
}
