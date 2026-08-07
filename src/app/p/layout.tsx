export default function PublicPortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden overflow-y-visible">
      {children}
    </div>
  );
}
