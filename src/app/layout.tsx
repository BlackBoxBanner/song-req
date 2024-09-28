import type { Metadata } from "next";
import { Maitree } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "@/components/context/socketContext";

const maitree = Maitree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ขอเพลง",
  description: "แอปพลิเคชันสำหรับขอเพลงขณะไลฟ์สด",
  keywords: ["ขอเพลง", "ไลฟ์สด", "เพลง", "แอปพลิเคชัน"],
  authors: [{ name: "Sueksit Vachirakumthorn" }],
  creator: "Sueksit Vachirakumthorn",
  applicationName: "ขอเพลง",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={maitree.className}>
        <Toaster />
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
