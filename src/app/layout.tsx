
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* If your Sidebar is a component, it should be used here 
            or inside the dashboard/layout.tsx */}
        {children}
      </body>
    </html>
  );
}
