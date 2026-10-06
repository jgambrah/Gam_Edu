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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18497577658"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18497577658');
            `,
          }}
        />
        {/* Event snippet for Page view conversion page */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              gtag('event', 'conversion', {
                  'send_to': 'AW-18497577658/E_YlCOPBlJMdELrFqvRE',
                  'value': 1.0,
                  'currency': 'USD'
              });
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Andika:wght@400;700&family=Comic+Neue:wght@400;700&family=Fredoka:wght@400;500;600;700;800;900&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
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
