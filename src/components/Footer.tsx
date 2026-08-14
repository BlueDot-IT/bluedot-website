import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

interface MenuItem {
  title: string;
  links: { text: string; url: string }[];
}

interface FooterProps {
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: { text: string; url: string }[];
}

export default function Footer({
  tagline = "Security, automation, and software for growing teams.",
  menuItems = [
    {
      title: "Services",
      links: [
        { text: "Security engineering", url: "/services#security-engineering" },
        { text: "Workflow automation", url: "/services#ai-automation" },
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
    { text: "Terms & Conditions", url: "/legal/terms" },
  ],
}: FooterProps) {
  return (
    <footer className="sr2-footer">
      <div className="sr2-wrap">
        <div className="sr2-footer-grid">
          <div>
            <Link href="/" className="sr2-brand" aria-label="BlueDot IT home">
              <span className="sr2-dot" aria-hidden="true" />
              <span>BlueDot <em>IT</em></span>
            </Link>
            <h2 className="sr-only">{tagline}</h2>
            <p>Practical engineering for teams that need working changes, clear boundaries, and a handoff they can operate.</p>
          </div>
          <div>
            <h3>Navigate</h3>
            <nav className="sr2-footer-nav" aria-label="Footer navigation">
              {menuItems.flatMap((section) => section.links).map((link) => <Link key={link.url} href={link.url}>{link.text}</Link>)}
            </nav>
          </div>
          <div className="sr2-footer-note">
            <NewsletterForm title="Product and security updates" description="A short email when BlueDot ships something useful. No spam." />
          </div>
        </div>
        <div className="sr2-legal">{new Date().getFullYear()} {copyright} · North Carolina / Remote · <Link href={bottomLinks[0].url}>{bottomLinks[0].text}</Link> · <Link href={bottomLinks[1].url}>{bottomLinks[1].text}</Link></div>
      </div>
    </footer>
  );
}

export { Footer };
