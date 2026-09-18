/* eslint-disable @next/next/no-html-link-for-pages -- Navigation crosses between standalone HTML and React routes; use full document loads. */
export default function Header() {
  return (
    <header className="spatial-backend-header">
      <a href="/" className="spatial-backend-brand" aria-label="BlueDot IT home"><span aria-hidden="true" />BlueDot IT</a>
      <nav aria-label="Main navigation">
        <a href="/#services">Services</a><a href="/work">Work</a>
        <a href="/#research">Research</a><a href="/#about">About</a>
        <a href="/#contact" className="spatial-backend-cta">Let&apos;s talk</a>
      </nav>
    </header>
  );
}
