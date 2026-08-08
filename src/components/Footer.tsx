import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface FooterProps {
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

export default function Footer({
  tagline = "Security engineering, AI automation, and full-stack development.",
  menuItems = [
    {
      title: "Services",
      links: [
        { text: "Security engineering", url: "/services#security-engineering" },
        { text: "AI automation", url: "/services#ai-automation" },
        { text: "Full-stack development", url: "/services/full-stack-development" },
        { text: "Security reviews", url: "/services/security-reviews" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "Work", url: "/projects" },
        { text: "About", url: "/about" },
        { text: "Insights", url: "/blog" },
        { text: "Contact", url: "/contact" },
      ],
    },
  ],
  copyright = "BlueDot IT. All rights reserved.",
  bottomLinks = [
    { text: "Privacy", url: "/legal/privacy" },
    { text: "Terms & Conditions", url: "/legal/terms"}
  ],
}: FooterProps) {
  return (
    <section className="relative mt-20 border-t border-white/10 bg-linear-to-b from-transparent via-white/5 to-white/10 text-base-content/90 backdrop-blur-xl">
      <div className="absolute inset-x-0 -top-32 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(77,216,255,0.14),transparent_45%)] blur-3xl opacity-70 pointer-events-none" />
      <div className="page-shell space-y-12">
        <footer className="space-y-10">
          <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_18px_50px_rgba(5,12,26,0.28)] md:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
                <Image
                  src="/bluedot-logo.png"
                  alt="BlueDot IT"
                  width={128}
                  height={128}
                  className="rounded-2xl border border-white/10 bg-white/5 p-2"
                />
              <p className="pill w-fit">BlueDot IT</p>
              <h2 className="heading-accent text-3xl font-bold leading-tight">
                {tagline}
              </h2>
              <p className="max-w-2xl text-base-content/80">
                Security engineering, AI automation, and full-stack development for startups, technical teams, and growing businesses.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn btn-primary btn-lg rounded-full px-6 shadow-[0_16px_38px_rgba(15,159,225,0.26)]">Discuss your project</Link>
                <Link href="/services" className="btn btn-outline btn-lg rounded-full px-6 border-white/20 hover:bg-white/10">Explore services</Link>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6 text-sm">
                {menuItems.map((section, sectionIdx) => (
                  <div key={sectionIdx} className="space-y-3">
                    <h3 className="text-base font-semibold text-primary">{section.title}</h3>
                    <ul className="space-y-2 text-base-content/80">
                      {section.links.map((link, linkIdx) => (
                        <li
                          key={linkIdx}
                          className="hover:text-primary transition"
                        >
                          <Link href={link.url}>{link.text}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <NewsletterForm />
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-sm text-base-content/70 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>{new Date().getFullYear()} {copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="hover:text-primary transition">
                  <Link href={link.url}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
