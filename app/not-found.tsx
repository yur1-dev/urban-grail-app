import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <p className="text-xs tracking-[6px] text-[#c9a84c] uppercase mb-4">
        404
      </p>
      <h1 className="text-[clamp(60px,12vw,140px)] font-black leading-none tracking-tight mb-6">
        LOST.
      </h1>
      <p className="text-[#5a5a5a] text-sm tracking-widest mb-10 text-center max-w-sm">
        This page doesn't exist. Maybe it dropped already.
      </p>
      <Link
        href="/"
        className="bg-[#c9a84c] text-[#0a0a0a] px-10 py-4 text-xs font-bold tracking-[4px] uppercase hover:bg-white transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
