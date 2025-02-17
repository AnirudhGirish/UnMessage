import type { Metadata } from "next";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "UnMessage",
  description: "Simple anonymus messaging application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <main>
            {children}
          </main>
          <Toaster/>
        </body>
      </AuthProvider>
    </html>
  );
}
