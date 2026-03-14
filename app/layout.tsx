import "@/app/globals.css";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const metadata = {
  title: "FixGuide Lab",
  description:
    "Tech support guides, student engineering projects, and community verification",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="page-shell mx-auto max-w-7xl px-5 py-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
