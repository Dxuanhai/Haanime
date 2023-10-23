import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/themes-provide";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Haanime",
  description: "Connect anime world",
  icons: {
    icon: "favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            font.className,
            "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-500 via-white to-slate-200 dark:from-indigo-900 dark:via-slate-600 dark:to-gray-950"
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            storageKey="hanime-theme"
          >
            <SocketProvider>
              <ModalProvider />
              {children}
            </SocketProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
