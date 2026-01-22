import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "rsuite/dist/rsuite-no-reset.min.css";
import "./globals.css";
import { Providers } from "./providers";
import StoreProvider from "@/redux/StoreProvider";
import { CustomProvider } from "rsuite";
import SessionWrapper from "@/components/layout/SessionWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Notebook Blog",
    template: "%s | Notebook Blog",
  },
  description: "A minimal, elegant blog template built with Next.js.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Notebook Blog",
    description: "A minimal, elegant blog template built with Next.js.",
    url: "http://localhost:3000",
    siteName: "Notebook Blog",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notebook Blog",
    description: "A minimal, elegant blog template built with Next.js.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <StoreProvider>
          <CustomProvider>
            <SessionWrapper>{children}</SessionWrapper>
          </CustomProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
