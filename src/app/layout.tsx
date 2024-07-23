import type {Metadata} from "next";
import {Maitree} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/toaster";
import {SocketProvider} from "@/components/context/socketContext";
import InitSocket from "@/components/client/initSocket";

const maitree = Maitree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ขอเพลง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={maitree.className}>
        <Toaster />
        <SocketProvider>
          <InitSocket />
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
