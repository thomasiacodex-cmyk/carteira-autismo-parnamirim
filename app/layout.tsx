import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Carteira do Autismo — Parnamirim/RN | CIPTEA Digital",
    template: "%s | CIPTEA Digital Parnamirim",
  },
  description:
    "Emissão e renovação da Carteira de Identificação da Pessoa com Transtorno do Espectro Autista (CIPTEA) — Prefeitura de Parnamirim/RN. Lei Romeo Mion nº 13.977/2020.",
  keywords: [
    "autismo",
    "CIPTEA",
    "carteira autismo",
    "Parnamirim",
    "PCD",
    "TEA",
    "Romeo Mion",
    "carteira de identificação",
    "transtorno do espectro autista",
  ],
  openGraph: {
    title: "Carteira do Autismo — Parnamirim/RN",
    description:
      "Solicite sua CIPTEA digital de forma rápida e segura. Emissão gratuita conforme Lei Romeo Mion.",
    type: "website",
    locale: "pt_BR",
    siteName: "CIPTEA Digital — Parnamirim/RN",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-autism-blue focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
            >
              Pular para o conteúdo principal
            </a>
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
