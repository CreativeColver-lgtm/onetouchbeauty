import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import AIChatAssistant from "@/components/AIChatAssistant";

export const metadata: Metadata = {
  title: "One Touch Beauty | Find & Book Beauty Services Near You",
  description: "Discover and book the best beauty professionals in your area. Hair, nails, makeup, facials and more — all at the touch of a button.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
          <AIChatAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
