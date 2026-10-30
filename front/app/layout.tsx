import Providers from "./providers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="vh-100 vw-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
