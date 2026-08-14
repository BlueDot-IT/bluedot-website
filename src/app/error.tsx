'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="sr2-close">
      <div className="sr2-wrap sr2-close-copy">
        <div><span className="sr2-kicker">Signal interrupted</span><h1>Something went wrong.</h1></div>
        <div><p>An unexpected error occurred. Try again or return to the public site.</p><div className="mt-6 flex flex-wrap gap-6"><button onClick={reset} className="sr2-text-button">Try again</button><Link href="/" className="sr2-link">Go back home</Link></div>{process.env.NODE_ENV === 'development' && <details className="mt-6"><summary className="cursor-pointer text-sm">Error details</summary><pre className="mt-2 overflow-auto text-xs">{error.message}</pre></details>}</div>
      </div>
    </section>
  );
}
