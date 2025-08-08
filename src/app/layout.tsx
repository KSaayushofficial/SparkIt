import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import MusicComponent from "@/components/audio/MusicComponent"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FocusFlow Dashboard",
  description: "A modern dashboard for focusers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <MusicComponent showUI={false}/> {/* mounted once, invisible on other pages */}
        </ThemeProvider>
      </body>
    </html>
  );
}
