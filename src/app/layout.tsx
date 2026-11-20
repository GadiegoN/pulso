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
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#080914" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pulsorede.com.br"),
  title: {
    default: "PULSO — Rede de Comunicação Local | A sua cidade em uma nova frequência",
    template: "%s | PULSO — Rede de Comunicação Local",
  },
  description:
    "A comunicação da sua cidade está evoluindo. Conecte comércios, empresas e moradores através de rádio digital web, WhatsApp integrado, portal local e difusão multimídia de alta eficiência.",
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
    "marketing local",
    "publicidade no interior",
  ],
  authors: [{ name: "Gadiego Nogueira", url: "https://www.gadiegon.com" }],
  creator: "Gadiego Nogueira",
  publisher: "Rede PULSO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://pulsorede.com.br",
  },
  openGraph: {
    title: "PULSO — Rede de Comunicação Local",
    description:
      "A sua cidade em uma nova frequência. Mais alcance para quem comunica, mais informação e conexão para quem vive a cidade.",
    url: "https://pulsorede.com.br",
    siteName: "Rede PULSO",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PULSO — Rede de Comunicação Local",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PULSO — Rede de Comunicação Local",
    description:
      "A comunicação da sua cidade está evoluindo. Conectando marcas e moradores através de uma rede moderna, inteligente e digital.",
    images: ["/og-image.png"],
    creator: "@pulsorede",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

// JSON-LD Structured Data Schema for Google Search
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://pulsorede.com.br/#organization",
      "name": "PULSO — Rede de Comunicação Local",
      "url": "https://pulsorede.com.br",
      "logo": "https://pulsorede.com.br/logo.png",
      "description":
        "Rede de comunicação e publicidade local integrada para cidades do interior do Brasil.",
      "email": "contato@pulsorede.com.br",
      "founder": {
        "@type": "Person",
        "name": "Gadiego Nogueira",
        "jobTitle": "CEO & Fundador",
        "url": "https://www.gadiegon.com",
        "sameAs": [
          "https://www.gadiegon.com",
          "https://github.com/GadiegoN"
        ]
      },
      "sameAs": [
        "https://instagram.com/pulsorede",
        "https://linkedin.com/company/pulsorede",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://pulsorede.com.br/#website",
      "url": "https://pulsorede.com.br",
      "name": "PULSO — Rede de Comunicação Local",
      "publisher": {
        "@id": "https://pulsorede.com.br/#organization",
      },
      "inLanguage": "pt-BR",
    },
    {
      "@type": "Service",
      "serviceType": "Rede de Comunicação e Publicidade Local",
      "provider": {
        "@id": "https://pulsorede.com.br/#organization",
      },
      "areaServed": {
        "@type": "Country",
        "name": "Brasil",
      },
      "description":
        "Difusão de campanhas comerciais, notícias municipais e ofertas via rádio digital na internet, canais de transmissão de WhatsApp e portal regional.",
    },
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased selection:bg-[#ff2a85] selection:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
