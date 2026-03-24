import type { Metadata, Viewport } from "next";
import './globals.css';
import Providers from './providers'; // Import the new client-side provider component
import { PWARegister } from "@/components/PWARegister";

// 1. Viewport Settings (Color, Scale, etc.)
export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// 2. SEO & PWA Metadata (Title, Description, Icons)
export const metadata: Metadata = {
  title: "GAM Edu - School Management System",
  description: "AI-Powered School Management & Learning Platform",
  manifest: "/manifest.json",
  
  // ✅ THE FIX: Force iOS and Android to use these specific image files for the Home Screen Icon
  icons: {
    icon: '/icons/icon-512x512.png', // Updated to /icons/ folder
    apple: '/icons/icon-512x512.png', // Updated to /icons/ folder
  },

  // iOS Specific Settings
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GAM Edu",
  },
  
  // Open Graph
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
