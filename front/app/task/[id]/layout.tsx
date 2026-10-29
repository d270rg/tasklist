import { Suspense } from "react";
import Task from "./page";

export default async function TaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<p>Loading task…</p>}>{children}</Suspense>;
}
