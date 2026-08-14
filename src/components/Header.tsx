import Link from "next/link";

export default function Header() {
  const links = [
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Insights" },
  ]

  return (
    <header className="sr2-header">
      <nav aria-label="Primary navigation" className="sr2-wrap sr2-header-inner">
        <Link href="/" className="sr2-brand" aria-label="BlueDot IT home">
          <span className="sr2-dot" aria-hidden="true" />
          <span>BlueDot <em>IT</em></span>
        </Link>
        <div className="sr2-nav">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="sr2-nav-link">
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/contact" className="sr2-contact-link">Contact BlueDot</Link>
      </nav>
    </header>
  );
}
