import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const formattedName = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'School';
  const title = `${formattedName} | GAM Edu Portal`;
  const description = `Welcome to ${formattedName}. Dedicated to academic excellence, leadership development, and character building.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: `${formattedName} - GAM Edu`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
