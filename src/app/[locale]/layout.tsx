import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import { LocaleSelect } from "@/components/LocaleSelect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Assurance emprunteur | Banque Paribas',
  description: 'Gerez facilement vos comptes bancaires et vos finances en ligne.',
  icons: {
    icon: "/favicon.jpg", // ou "/favicon.png" ou "/favicon.svg"
  },
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {


  return (
    <html lang='en'>
      <body>
        <Providers locale={params.locale}>  
          {children}
         <Toaster className="fixed top-0 right-0 z-100"/>
          </Providers>

      </body>
    </html>
  );
}
