import React from 'react';

/** Minimal stand-in for next/dynamic: React.lazy + Suspense (client only). Each dynamic import becomes its own chunk. */
export default function dynamic<P = any>(loader: () => Promise<any>, opts?: { loading?: React.ComponentType<any>; ssr?: boolean }) {
  const Lazy = React.lazy(async () => {
    const mod = await loader();
    return { default: (mod && mod.default) || mod };
  });
  const Loading = opts?.loading;
  const Wrapped = (props: P) => (
    <React.Suspense fallback={Loading ? <Loading /> : null}>
      <Lazy {...(props as any)} />
    </React.Suspense>
  );
  return Wrapped;
}
