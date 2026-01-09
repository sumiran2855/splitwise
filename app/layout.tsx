import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/src/styles/globals.css";
import "@/src/config/database";
import "@/src/config/shutdown";
import { NavigationProvider } from "@/src/contexts/navigationContext";
import { ProfileProvider } from "@/src/contexts/profileContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SplitEase Clone",
  description: "Split expenses with friends and groups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavigationProvider>
          <ProfileProvider>
            {children}
          </ProfileProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
