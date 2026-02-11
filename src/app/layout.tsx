import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { StorageBootstrap } from "@/components/storage-bootstrap";
import "./globals.css";

export const metadata: Metadata = {
  title: "Humana - Patient Management",
  description: "UX Product Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StorageBootstrap>{children}</StorageBootstrap>
        </ThemeProvider>
      </body>
    </html>
  );
}
