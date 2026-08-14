"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const links = [
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Insights" },
    { href: "/contact", label: "Contact" },
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
            <a key={item.href} href={item.href} className="sr2-nav-link" aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
