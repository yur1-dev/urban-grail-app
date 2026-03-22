import Link from "next/link";

function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconFacebook({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconTiktok({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  );
}

const SHOP_LINKS = [
  { href: "/shop", label: "All Products" },
  { href: "/shop?category=tees", label: "Tees" },
  { href: "/shop?category=hoodies", label: "Hoodies" },
  { href: "/shop?category=shoes", label: "Shoes" },
  { href: "/shop?category=bags", label: "Bags" },
  { href: "/shop?category=slippers", label: "Slippers" },
  { href: "/shop?category=accessories", label: "Accessories" },
];

const ACCOUNT_LINKS = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Create Account" },
  { href: "/account", label: "My Orders" },
  { href: "/account?tab=profile", label: "Profile" },
];

const HELP_LINKS = [
  { href: "#", label: "Shipping Info" },
  { href: "#", label: "Returns & Exchange" },
  { href: "#", label: "Size Guide" },
  { href: "#", label: "Contact Us" },
  { href: "#", label: "FAQ" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/urban.grail",
    icon: <IconInstagram size={18} />,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/TheUrbanGrail",
    icon: <IconFacebook size={17} />,
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1e1e1e] relative overflow-hidden">
      {/* Subtle gold glow top-left */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: "40vw",
          height: "40vw",
          maxWidth: 500,
          maxHeight: 500,
          background:
            "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 65%)",
        }}
      />

      {/* ── Main footer grid ── */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 xl:gap-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-0 mb-5">
              <span
                className="text-2xl font-black text-white"
                style={{ letterSpacing: "0.18em" }}
              >
                URBAN
              </span>
              <span
                className="text-2xl font-black text-[#c9a84c]"
                style={{ letterSpacing: "0.18em" }}
              >
                GRAIL
              </span>
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-[#c9a84c] self-end mb-1.5 opacity-80" />
            </Link>

            <p className="text-xs text-[#3a3a3a] leading-[1.9] mb-6 max-w-[200px]">
              Premium streetwear from Manila. Crafted for those who move with
              intent.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-1">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-9 h-9 flex items-center justify-center border border-[#1e1e1e] text-[#3a3a3a] hover:text-[#c9a84c] hover:border-[#c9a84c]/40 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <div>
            <p className="text-[10px] tracking-[4px] uppercase text-[#5a5a5a] mb-5 flex items-center gap-2">
              <span className="w-3 h-px bg-[#c9a84c]" />
              Shop
            </p>
            <ul className="space-y-3">
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-[#3a3a3a] hover:text-[#c9a84c] transition-colors tracking-wider"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account column */}
          <div>
            <p className="text-[10px] tracking-[4px] uppercase text-[#5a5a5a] mb-5 flex items-center gap-2">
              <span className="w-3 h-px bg-[#c9a84c]" />
              Account
            </p>
            <ul className="space-y-3">
              {ACCOUNT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-[#3a3a3a] hover:text-[#c9a84c] transition-colors tracking-wider"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help column */}
          <div>
            <p className="text-[10px] tracking-[4px] uppercase text-[#5a5a5a] mb-5 flex items-center gap-2">
              <span className="w-3 h-px bg-[#c9a84c]" />
              Help
            </p>
            <ul className="space-y-3">
              {HELP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-xs text-[#3a3a3a] hover:text-[#c9a84c] transition-colors tracking-wider"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact card */}
            <div className="mt-6 border border-[#1e1e1e] p-4 bg-[#111111]">
              <p className="text-[9px] tracking-[3px] uppercase text-[#5a5a5a] mb-2">
                Direct message
              </p>
              <a
                href="https://instagram.com/urbangrail"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c9a84c] text-xs hover:text-white transition-colors flex items-center gap-1.5"
              >
                <IconInstagram size={13} />
                @urbangrail
              </a>
            </div>
          </div>
        </div>

        {/* ── Newsletter strip ── */}
        {/* <div className="mt-14 border border-[#1e1e1e] p-6 bg-[#111111] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-black tracking-widest uppercase mb-1">
              Get Early Access to Drops
            </p>
            <p className="text-xs text-[#5a5a5a]">
              No spam. Only new arrivals and limited releases.
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-0">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-64 bg-[#0a0a0a] border border-[#1e1e1e] border-r-0 text-white px-4 py-3 text-xs focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-[#3a3a3a]"
            />
            <button className="bg-[#c9a84c] text-[#0a0a0a] px-6 py-3 text-[11px] font-black tracking-[3px] uppercase hover:bg-white transition-colors flex-shrink-0">
              Notify Me
            </button>
          </div>
        </div> */}

        {/* ── Bottom bar ── */}
        <div className="mt-10 pt-6 border-t border-[#1e1e1e] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-[10px] text-[#2a2a2a] tracking-widest">
              © {year} Urban Grail. All rights reserved.
            </p>
            <span className="text-[#1e1e1e] hidden md:block">·</span>
            <p className="text-[10px] text-[#2a2a2a] tracking-widest">
              Made with intent. Manila, PH.
            </p>
          </div>

          <div className="flex items-center gap-5">
            {[
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[10px] text-[#2a2a2a] hover:text-[#5a5a5a] tracking-widest transition-colors uppercase"
              >
                {l.label}
              </Link>
            ))}

            {/* Payment badges */}
            <div className="flex items-center gap-2 ml-2">
              {["COD", "GCash"].map((p) => (
                <span
                  key={p}
                  className="text-[8px] tracking-[2px] uppercase border border-[#1e1e1e] text-[#3a3a3a] px-2 py-1"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
