"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingBag,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";

function IconInstagram({ size = 16 }: { size?: number }) {
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

function IconFacebook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/urban.grail",
    icon: <IconInstagram size={16} />,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/TheUrbanGrail",
    icon: <IconFacebook size={15} />,
  },
];

export function Navbar() {
  const { data: session } = useSession();
  const toggleCart = useCartStore((s) => s.toggleCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const count = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const user = session?.user as any;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleSignOut() {
    clearCart();
    signOut({ callbackUrl: "/" });
  }

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,10,0.98)" : "rgba(10,10,10,0.88)",
          backdropFilter: "blur(18px)",
          borderBottom: scrolled
            ? "1px solid rgba(201,168,76,0.14)"
            : "1px solid rgba(30,30,30,0.9)",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.5)" : "none",
        }}
      >
        {/* Gold scroll progress bar */}
        <div
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[#c9a84c] to-[#f0d080] transition-all duration-500 pointer-events-none"
          style={{ width: scrolled ? "100%" : "0%" }}
        />

        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <span
              className="text-xl font-black text-white group-hover:text-[#e8e8e8] transition-colors"
              style={{ letterSpacing: "0.18em" }}
            >
              URBAN
            </span>
            <span
              className="text-xl font-black text-[#c9a84c]"
              style={{ letterSpacing: "0.18em" }}
            >
              GRAIL
            </span>
            <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0 self-end mb-1.5 opacity-80" />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-0.5">
            {/* Social icons — desktop only */}
            <div className="hidden md:flex items-center gap-0.5 mr-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-8 h-8 flex items-center justify-center text-[#3a3a3a] hover:text-[#c9a84c] transition-colors"
                >
                  {s.icon}
                </a>
              ))}
              <span className="w-px h-4 bg-[#1e1e1e] mx-1" />
            </div>

            {/* Auth */}
            {session ? (
              <>
                {user?.role === "admin" && (
                  <Link
                    href="/dashboard"
                    title="Admin Dashboard"
                    className="w-9 h-9 flex items-center justify-center text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
                  >
                    <LayoutDashboard size={17} />
                  </Link>
                )}
                <Link
                  href="/account"
                  title="My Account"
                  className="group relative w-9 h-9 flex items-center justify-center text-[#5a5a5a] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User size={17} />
                  <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 text-[8px] tracking-[2px] uppercase text-[#5a5a5a] bg-[#111] border border-[#1e1e1e] px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Account
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="group relative w-9 h-9 flex items-center justify-center text-[#5a5a5a] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                >
                  <LogOut size={17} />
                  <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 text-[8px] tracking-[2px] uppercase text-[#5a5a5a] bg-[#111] border border-[#1e1e1e] px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Sign out
                  </span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center text-[11px] tracking-[3px] uppercase text-[#5a5a5a] hover:text-[#c9a84c] transition-colors px-3 py-2 border border-transparent hover:border-[#c9a84c]/20"
              >
                Login
              </Link>
            )}

            <span className="w-px h-5 bg-[#1e1e1e] mx-1 hidden md:block" />

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative w-9 h-9 flex items-center justify-center text-[#5a5a5a] hover:text-white transition-colors"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <>
                  <span
                    className="absolute -top-0.5 -right-0.5 bg-[#c9a84c] text-[#0a0a0a] font-black flex items-center justify-center"
                    style={{
                      minWidth: 16,
                      height: 16,
                      borderRadius: 8,
                      fontSize: 9,
                      padding: "0 3px",
                    }}
                  >
                    {count > 99 ? "99+" : count}
                  </span>
                  <span
                    className="absolute -top-0.5 -right-0.5 rounded-full bg-[#c9a84c] animate-ping opacity-25 pointer-events-none"
                    style={{ width: 16, height: 16 }}
                  />
                </>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-[#5a5a5a] hover:text-white transition-colors ml-1"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 z-40 bg-[#0a0a0a] border-b border-[#1e1e1e] md:hidden">
            <div className="px-6 py-4 space-y-0.5">
              {/* Shop links */}
              {[
                { href: "/shop", label: "All Products" },
                { href: "/shop?category=tees", label: "Tees" },
                { href: "/shop?category=hoodies", label: "Hoodies" },
                { href: "/shop?category=shoes", label: "Shoes" },
                { href: "/shop?category=bags", label: "Bags" },
                { href: "/shop?category=slippers", label: "Slippers" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-3 py-3.5 text-[11px] tracking-[3px] uppercase text-[#5a5a5a] hover:text-white hover:bg-[#111] border-l-2 border-transparent hover:border-[#c9a84c] transition-all"
                >
                  {link.label}
                  <span className="text-[#2a2a2a] text-xs">→</span>
                </Link>
              ))}

              <div className="pt-3 mt-2 border-t border-[#1e1e1e] space-y-0.5">
                {session ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3.5 text-[11px] tracking-[3px] uppercase text-[#5a5a5a] hover:text-white hover:bg-[#111] border-l-2 border-transparent hover:border-[#c9a84c] transition-all"
                    >
                      <User size={13} /> My Account
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-3.5 text-[11px] tracking-[3px] uppercase text-[#c9a84c] hover:bg-[#111] border-l-2 border-transparent hover:border-[#c9a84c] transition-all"
                      >
                        <LayoutDashboard size={13} /> Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3.5 text-[11px] tracking-[3px] uppercase text-[#5a5a5a] hover:text-red-400 hover:bg-[#111] border-l-2 border-transparent transition-all"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3.5 text-[11px] tracking-[3px] uppercase text-[#c9a84c] hover:bg-[#111] border-l-2 border-[#c9a84c] transition-all"
                  >
                    Login →
                  </Link>
                )}

                {/* Mobile socials */}
                <div className="flex items-center gap-3 px-3 pt-4 pb-1 border-t border-[#1e1e1e] mt-2">
                  <span className="text-[9px] tracking-[3px] uppercase text-[#3a3a3a]">
                    Follow us
                  </span>
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3a3a3a] hover:text-[#c9a84c] transition-colors"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
