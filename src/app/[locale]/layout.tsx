import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

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
         
          </Providers>

      </body>
    </html>
  );
}
