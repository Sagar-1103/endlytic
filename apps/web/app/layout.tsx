
import type { Metadata } from "next";
import localFont from "next/font/local";
import SessionProviderWrapper from "./providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Endlytic",
  description: "An AI powered platform that transforms API specs or Postman collections into natural language answers, ready-to-use code snippets and auto-generated SDKs helping developers understand, test and integrate APIs instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#07090e]`}>
         <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
