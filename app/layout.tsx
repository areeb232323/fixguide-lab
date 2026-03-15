import "@/app/globals.css";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { ToastProvider } from "@/components/toast-provider";

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
        <ToastProvider>
          <SiteHeader />
          <main className="page-shell mx-auto max-w-7xl px-5 py-10">
            {children}
          </main>
          <SiteFooter />
        </ToastProvider>
      </body>
    </html>
  );
}
