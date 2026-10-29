import { Suspense } from "react";

export function generateStaticParams() {
  return [{ id: "" }];
}

export default async function TaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<p>Loading task…</p>}>{children} </Suspense>;
}
