import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  ClerkLoaded,
  ClerkLoading
} from '@clerk/nextjs';
import Navbar from "@/components/Navbar";
import { dark } from "@clerk/themes";
import SaveUserOnLogin from "@/components/SaveUserOnLogin"; // Import the component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoadGen Energy",
  description: "Harnessing Every Drive for a Greener Tomorrow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ClerkLoading>
            <div className="flex items-center justify-center h-screen text-2xl">
              LOADING....
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <SaveUserOnLogin /> {/* Add this line to trigger saving on login */}
            <div className="min-h-screen">
              <Navbar />
              {children}
            </div>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
