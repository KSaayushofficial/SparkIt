import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutClientWrapper } from "./LayoutClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Spark It",
  description: "Spark It — Ignite Your Productivity",
  icons: {
    icon: "/favicon.ico",  
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <LayoutClientWrapper>{children}</LayoutClientWrapper>
      </body>
    </html>
  );
}
