import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#080914" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "PULSO — Rede de Comunicação Local | A sua cidade em uma nova frequência",
  description:
    "A comunicação da sua cidade está evoluindo. Conecte comércios, empresas e moradores através de rádio digital, WhatsApp integrado, portal local e difusão multimídia de alta eficiência.",
  keywords: [
    "PULSO",
    "pulso rede",
    "comunicação local",
    "publicidade local",
    "rádio digital",
    "divulgação comercial",
    "comércio do interior",
    "WhatsApp para empresas",
    "portal regional",
    "alternativa a carros de som",
  ],
  authors: [{ name: "Rede PULSO" }],
  openGraph: {
    title: "PULSO — Rede de Comunicação Local",
    description:
      "A sua cidade em uma nova frequência. Mais alcance para quem comunica, mais informação e conexão para quem vive a cidade.",
    url: "https://pulsorede.com.br",
    siteName: "PULSO",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PULSO — Rede de Comunicação Local",
    description:
      "A comunicação da sua cidade está evoluindo. Conectando marcas e moradores através de uma rede moderna, inteligente e digital.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased selection:bg-[#ff2a85] selection:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
