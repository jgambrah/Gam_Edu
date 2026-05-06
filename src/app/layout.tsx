import type { Metadata, Viewport } from "next";
import './globals.css';
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
    <html lang="en">
      <head>
      </head>
      <body className="antialiased">
        <PWARegister />
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
