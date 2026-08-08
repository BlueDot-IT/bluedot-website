// src/components/Header.tsx
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import ThemeSwitch from "./ThemeSwitch";

export default async function Header() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-linear-to-r from-white/5 via-primary/8 to-white/5 backdrop-blur-2xl border-b border-white/10 shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
      <nav className="page-shell relative flex items-center gap-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-base-content">
          <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-inner">
            <Image alt="logo" src="/bluedot-logo.png" fill className="object-contain" sizes="40px" />
          </div>
          <div className="leading-tight">
            <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-base-content/60">Automation • Systems</span>
            <span className="block text-lg heading-accent">BlueDot IT</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 text-sm font-medium">
          {[
            { href: "/about", label: "About" },
            { href: "/projects", label: "Projects" },
            { href: "/services", label: "Services" },
            { href: "/blog", label: "Blog" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-base-content/80 hover:text-primary hover:bg-white/5 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="md:hidden absolute left-0 right-0 top-full flex gap-1 overflow-x-auto border-b border-white/10 bg-black/90 px-4 py-2 text-xs font-semibold backdrop-blur-xl">
          {[
            { href: "/services", label: "Services" },
            { href: "/projects", label: "Projects" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-base-content/80 hover:bg-white/5 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-primary text-primary-content px-4 py-2 text-sm font-semibold shadow-[0_12px_30px_rgba(15,159,225,0.28)] hover:-translate-y-0.5 transition"
          >
            Describe the problem
          </Link>

          {session ? (
            <form action="/api/auth/signout" method="post">
              <button className="rounded-full px-4 py-2 text-sm font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/api/auth/signin" className="rounded-full px-4 py-2 text-sm font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition">
              Sign in
            </Link>
          )}
          <ThemeSwitch className="btn-ghost border border-white/10" />
        </div>
      </nav>
    </header>
  );
}
