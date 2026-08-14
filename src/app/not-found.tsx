import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you\'re looking for doesn\'t exist or has been moved.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="sr2-close">
      <div className="sr2-wrap sr2-close-copy">
        <div><span className="sr2-kicker">No signal</span><h1>Page not found.</h1></div>
        <div><p>The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.</p><div className="mt-6 flex flex-wrap gap-6"><Link href="/" className="sr2-link">Go back home</Link><Link href="/blog" className="sr2-link">Browse insights</Link></div></div>
      </div>
    </section>
  );
}
