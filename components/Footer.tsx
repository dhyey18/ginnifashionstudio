import { InstagramLogo, FacebookLogo, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";

const FOOTER_LINKS: Record<string, string[]> = {
  Shop: ["New Arrivals", "Sarees", "Anarkalis", "Lehengas", "Kurta Sets", "Sale"],
  Help: ["Size Guide", "Track Order", "Returns & Exchanges", "Contact Us", "FAQs"],
  Company: ["About Ginni's", "Artisan Stories", "Sustainability", "Press", "Careers"],
};

export function Footer() {
  return (
    <footer className="g-footer">
      <div className="g-footer-grid g-container--wide" style={{ padding: "0 var(--sp-7)" }}>
        <div>
          <p className="g-footer-brand">Ginni&apos;<span>s</span></p>
          <p className="g-footer-sub">Fashion Studio</p>
          <p className="g-footer-tag">
            Celebrating the art of Indian ethnic wear since 2018. Handpicked, handcrafted, delivered with love.
          </p>
          <div style={{ display: "flex", gap: "var(--sp-3)", marginTop: "var(--sp-4)" }}>
            {[
              { Icon: InstagramLogo, label: "Instagram" },
              { Icon: FacebookLogo, label: "Facebook" },
              { Icon: YoutubeLogo, label: "YouTube" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                style={{
                  width: 38, height: 38, borderRadius: "var(--r-md)",
                  border: "1px solid rgba(199,59,106,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(253,250,247,0.7)",
                  transition: "all var(--dur-base)",
                }}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([section, links]) => (
          <div key={section}>
            <h5>{section}</h5>
            <ul>
              {links.map((link) => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}

        <div className="g-footer-news">
          <label htmlFor="newsletter">Newsletter</label>
          <input id="newsletter" type="email" placeholder="your@email.com" />
        </div>
      </div>

      <div className="g-footer-bottom" style={{ padding: "0 var(--sp-7)", maxWidth: 1440, margin: "0 auto" }}>
        <span>&copy; {new Date().getFullYear()} Ginni&apos;s Fashion Studio</span>
        <span>Privacy &nbsp;·&nbsp; Terms</span>
      </div>
    </footer>
  );
}
