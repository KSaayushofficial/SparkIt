import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import MusicComponent from "@/components/audio/MusicComponent"; // ✅ Import it

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KokonutUI Dashboard",
  description: "A modern dashboard with theme switching",
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
          <MusicComponent /> {/* mounted once, invisible on other pages */}
        </ThemeProvider>
      </body>
    </html>
  );
}
