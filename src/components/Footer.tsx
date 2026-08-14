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
  tagline = "Security, AI automation, and full-stack delivery for systems that have to work.",
  menuItems = [
    {
      title: "Services",
      links: [
        { text: "Security engineering", url: "/services" },
        { text: "Workflow automation", url: "/services" },
        { text: "Full-stack development", url: "/services/full-stack-development" },
        { text: "Security reviews", url: "/services/security-reviews" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "Work", url: "/projects" },
        { text: "Open source", url: "/open-source" },
        { text: "About", url: "/about" },
        { text: "Insights", url: "/blog" },
        { text: "Security", url: "/security" },
        { text: "Contact", url: "/contact" },
      ],
    },
  ],
  copyright = "BlueDot IT. All rights reserved.",
  bottomLinks = [
    { text: "Privacy", url: "/legal/privacy" },
    { text: "Terms & Conditions", url: "/legal/terms" },
    { text: "Security posture", url: "/security" },
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
          <div className="sr2-footer-nav-groups">
            {menuItems.map((section) => (
              <div className="sr2-footer-nav-group" key={section.title}>
                <h3>{section.title}</h3>
                <nav className="sr2-footer-nav" aria-label={`${section.title} navigation`}>
                  {section.links.map((link) => <a key={link.text} href={link.url}>{link.text}</a>)}
                </nav>
              </div>
            ))}
          </div>
          <div className="sr2-footer-note">
            <NewsletterForm title="Product and security updates" description="A short email when BlueDot ships something useful. No spam." />
          </div>
        </div>
        <div className="sr2-legal">{new Date().getFullYear()} {copyright} · North Carolina / Remote · <a href={bottomLinks[0].url}>{bottomLinks[0].text}</a> · <a href={bottomLinks[1].url}>{bottomLinks[1].text}</a></div>
      </div>
    </footer>
  );
}

export { Footer };
