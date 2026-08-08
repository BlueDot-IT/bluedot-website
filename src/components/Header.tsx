// src/components/Header.tsx
import Link from "next/link";
import Image from "next/image";
import ThemeSwitch from "./ThemeSwitch";

export default function Header() {
  return (
    <header className="authority-site-header">
      <nav aria-label="Primary navigation" className="authority-wrap authority-nav">
        <Link href="/" className="authority-brand">
          <div className="authority-brand-mark">
            <Image alt="BlueDot IT" src="/bluedot-logo.png" fill className="object-contain" sizes="34px" />
          </div>
          <div>
            <span>BlueDot IT<small>Security · Automation · Systems</small></span>
          </div>
        </Link>

        <div className="authority-nav-links hidden md:flex">
          {[
            { href: "/services", label: "Services" },
            { href: "/projects", label: "Work" },
            { href: "/about", label: "About" },
            { href: "/blog", label: "Insights" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="authority-nav-link"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div role="navigation" aria-label="Mobile primary navigation" className="authority-mobile-nav md:hidden">
          {[
            { href: "/services", label: "Services" },
            { href: "/projects", label: "Work" },
            { href: "/about", label: "About" },
            { href: "/blog", label: "Insights" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="authority-nav-link"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/contact"
            className="authority-nav-cta"
          >
            <span className="sm:hidden">Discuss</span>
            <span className="hidden sm:inline">Discuss your project</span>
          </Link>
          <ThemeSwitch className="authority-theme-switch" />
        </div>
      </nav>
    </header>
  );
}
