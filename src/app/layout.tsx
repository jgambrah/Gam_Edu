import type { Metadata, Viewport } from "next";
import './globals.css';
import 'katex/dist/katex.min.css';
import Providers from './providers'; 
import { PWARegister } from "@/components/PWARegister";

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "GAM Edu - School Management System",
  description: "AI-Powered School Management & Learning Platform",
  manifest: "/manifest.json",
  icons: {
    icon: '/icons/icon-512x512.png',
    apple: '/icons/icon-512x512.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GAM Edu",
  },
  openGraph: {
    title: "GAM Edu Portal",
    description: "Login to access your student or staff dashboard.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Fredoka:wght@400;500;600;700;800;900&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <PWARegister />
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
