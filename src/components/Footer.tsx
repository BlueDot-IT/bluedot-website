/* eslint-disable @next/next/no-html-link-for-pages -- Navigation crosses between standalone HTML and React routes; use full document loads. */
export default function Footer() {
  return (
    <footer className="spatial-backend-footer">
      <a href="/" className="spatial-backend-brand"><span aria-hidden="true" />BlueDot IT</a>
      <nav aria-label="Footer navigation">
        <a href="/#services">Services</a><a href="/work">Work</a>
        <a href="/#research">Research</a><a href="/#about">About</a>
        <a href="/process">Process</a><a href="/blog">Articles</a>
        <a href="/#contact">Contact</a><a href="/security">Security</a>
        <a href="/legal/privacy">Privacy</a><a href="/legal/terms">Terms</a>
      </nav>
      <p>© {new Date().getFullYear()} BlueDot IT LLC</p>
    </footer>
  );
}
export { Footer };
