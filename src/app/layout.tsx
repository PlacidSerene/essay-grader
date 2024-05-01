import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/Providers";
import { createTheme, MantineProvider } from "@mantine/core";
import "react-loading-skeleton/dist/skeleton.css";
import "@mantine/dropzone/styles.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <ClerkProvider>
        <html lang="en" className="light">
          <body
            className={cn(
              "inter.className min-h-screen font-sans antialiased",
              inter.className
            )}
          >
            {/* <Navbar /> */}
            <MantineProvider>{children}</MantineProvider>
          </body>
        </html>
      </ClerkProvider>
    </Providers>
  );
}
