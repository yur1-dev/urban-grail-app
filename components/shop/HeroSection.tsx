import Link from "next/link";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-end relative overflow-hidden bg-[#0a0a0a] pb-16 pt-24">
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Gold glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-10%",
          left: "-5%",
          width: "60vw",
          height: "60vw",
          maxWidth: 700,
          maxHeight: 700,
          background:
            "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Top rule — sits right at nav bottom edge */}
      <div className="absolute top-[64px] left-0 right-0 h-px">
        <div className="max-w-7xl mx-auto px-6 h-px bg-gradient-to-r from-[#c9a84c]/20 via-[#1e1e1e] to-transparent" />
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="max-w-7xl mx-auto px-6 h-px bg-gradient-to-r from-transparent via-[#1e1e1e] to-transparent" />
      </div>

      {/* ── All content inside same max-w-7xl mx-auto px-6 as navbar/footer ── */}
      <div className="max-w-7xl mx-auto px-6 w-full">
        {/* Vertical side label — positioned inside the container */}
        <div
          className="absolute right-6 bottom-1/3 hidden lg:flex items-center gap-3"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            right: "max(24px, calc((100vw - 1280px) / 2 + 24px))",
          }}
        >
          <span className="text-[9px] tracking-[5px] text-[#2a2a2a] uppercase">
            Est. Manila 2024
          </span>
          <span className="w-px h-12 bg-[#1e1e1e]" />
          <span className="text-[9px] tracking-[5px] text-[#c9a84c]/40 uppercase">
            Streetwear
          </span>
        </div>

        {/* Main 2-col grid */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 xl:gap-16 items-end">
          {/* LEFT */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-6 h-px bg-[#c9a84c]" />
              <p className="text-[10px] tracking-[6px] text-[#c9a84c] uppercase font-medium">
                Est. Manila · Streetwear Culture
              </p>
            </div>

            <h1
              className="font-black leading-[0.85] tracking-tight mb-10 select-none"
              style={{ fontSize: "clamp(72px, 13vw, 172px)" }}
            >
              <span
                className="block"
                style={{
                  WebkitTextStroke: "1px rgba(240,236,228,0.12)",
                  color: "transparent",
                  letterSpacing: "-0.02em",
                }}
              >
                WEAR
              </span>
              <span
                className="block text-[#c9a84c]"
                style={{
                  letterSpacing: "-0.02em",
                  textShadow: "0 0 80px rgba(201,168,76,0.15)",
                }}
              >
                YOUR
              </span>
              <span
                className="block text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                GRAIL
              </span>
            </h1>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-xs">
                <p className="text-sm text-[#5a5a5a] leading-[1.8] font-light">
                  Premium streetwear crafted for those who move with intent.{" "}
                  <span className="text-[#c9a84c]">Limited drops</span> — now
                  available online.
                </p>
                <div className="flex items-center gap-6 mt-5">
                  {[
                    { value: "25+", label: "Products" },
                    { value: "PH", label: "Shipping" },
                    { value: "↑", label: "New Drop" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-[#c9a84c] text-sm font-black">
                        {s.value}
                      </p>
                      <p className="text-[#3a3a3a] text-[10px] tracking-[3px] uppercase mt-0.5">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/shop"
                  className="group relative overflow-hidden bg-[#c9a84c] text-[#0a0a0a] px-8 py-4 text-[11px] font-black tracking-[5px] uppercase hover:bg-white transition-all flex items-center gap-3"
                >
                  <span
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    }}
                  />
                  Browse Collection
                  <span className="text-[#0a0a0a]/40 font-light">→</span>
                </Link>
                <Link
                  href="/register"
                  className="border border-[#2a2a2a] text-[#5a5a5a] px-8 py-4 text-[11px] font-bold tracking-[5px] uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
                >
                  Join the Culture
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT — category quick-nav */}
          <div className="hidden lg:flex flex-col gap-2 pb-1">
            <p className="text-[9px] tracking-[5px] uppercase text-[#3a3a3a] mb-2 flex items-center gap-2">
              <span className="w-3 h-px bg-[#3a3a3a]" />
              Browse by Category
            </p>

            {[
              {
                label: "Tees",
                href: "/shop?category=tees",
                count: 25,
                badge: null,
              },
              {
                label: "Hoodies",
                href: "/shop?category=hoodies",
                count: 12,
                badge: "HOT",
              },
              {
                label: "Shoes",
                href: "/shop?category=shoes",
                count: 8,
                badge: null,
              },
              {
                label: "Bags",
                href: "/shop?category=bags",
                count: 6,
                badge: null,
              },
              {
                label: "Slippers",
                href: "/shop?category=slippers",
                count: 4,
                badge: null,
              },
              {
                label: "Accessories",
                href: "/shop?category=accessories",
                count: 0,
                badge: "SOON",
              },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex items-center justify-between px-4 py-3 border border-[#1a1a1a] hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 transition-all duration-150"
              >
                <div className="flex items-center gap-3">
                  <span className="w-[3px] h-4 bg-[#1e1e1e] group-hover:bg-[#c9a84c] transition-colors rounded-full flex-shrink-0" />
                  <span className="text-[11px] tracking-[3px] uppercase text-[#5a5a5a] group-hover:text-white transition-colors font-medium">
                    {cat.label}
                  </span>
                  {cat.badge && (
                    <span
                      className={`text-[8px] tracking-[2px] uppercase px-1.5 py-0.5 font-black ${
                        cat.badge === "HOT"
                          ? "bg-[#c9a84c] text-[#0a0a0a]"
                          : "border border-[#2a2a2a] text-[#3a3a3a]"
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {cat.count > 0 && (
                    <span className="text-[10px] text-[#2a2a2a] group-hover:text-[#5a5a5a] transition-colors tabular-nums">
                      {cat.count}
                    </span>
                  )}
                  <span className="text-[#2a2a2a] group-hover:text-[#c9a84c] transition-all group-hover:translate-x-0.5 inline-block text-xs">
                    →
                  </span>
                </div>
              </Link>
            ))}

            <Link
              href="/shop"
              className="mt-1 flex items-center justify-center gap-2 border border-dashed border-[#1e1e1e] hover:border-[#c9a84c]/30 py-3 text-[10px] tracking-[4px] uppercase text-[#3a3a3a] hover:text-[#c9a84c] transition-all"
            >
              View All →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
