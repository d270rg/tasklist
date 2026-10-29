import "bootstrap/dist/css/bootstrap.css";

import "../globals.css";

export function generateStaticParams() {
  return [{ page: "1" }];
}

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
