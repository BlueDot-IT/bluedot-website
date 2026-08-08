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
    { text: "Terms & Conditions", url: "/legal/terms"}
  ],
}: FooterProps) {
  return (
    <section className="authority-footer">
      <div className="authority-wrap">
        <footer>
          <div className="authority-footer-grid">
            <div>
                <Image
                  src="/bluedot-logo.png"
                  alt="BlueDot IT"
                  width={72}
                  height={72}
                  className="authority-footer-logo"
                />
              <p className="authority-footer-label">BlueDot IT</p>
              <h2>
                {tagline}
              </h2>
              <p className="authority-footer-copy">
                Practical engineering for teams that need working changes, clear boundaries, and a handoff they can operate.
              </p>
              <div className="authority-footer-buttons">
                <Link href="/contact" className="authority-button">Discuss your project</Link>
                <Link href="/services" className="authority-button authority-button-secondary">Explore services</Link>
              </div>
            </div>
            <div className="authority-footer-side">
              <div className="authority-footer-links">
                {menuItems.map((section, sectionIdx) => (
                  <div key={sectionIdx}>
                    <h3>{section.title}</h3>
                    <ul>
                      {section.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <Link href={link.url}>{link.text}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <NewsletterForm title="Product and security updates" description="A short email when BlueDot ships something useful. No spam." />
            </div>
          </div>

          <div className="authority-footer-bottom">
            <p>{new Date().getFullYear()} {copyright}</p>
            <ul>
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx}>
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
