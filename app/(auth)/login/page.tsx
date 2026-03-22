"use client";
import { Suspense } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { ...form, redirect: false });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    if (callbackUrl !== "/") {
      router.push(callbackUrl);
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  }

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <p className="text-xs tracking-[5px] text-[#c9a84c] uppercase mb-3">
          Welcome Back
        </p>
        <h1 className="text-5xl font-black tracking-tight mb-2">LOGIN</h1>
        <p className="text-[#5a5a5a] text-sm mb-10">Sign in to your account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="border border-red-800 bg-red-900/20 text-red-400 text-xs p-4">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs tracking-[3px] uppercase text-[#5a5a5a] mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#111111] border border-[#1e1e1e] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs tracking-[3px] uppercase text-[#5a5a5a]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] tracking-[2px] uppercase text-[#5a5a5a] hover:text-[#c9a84c] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-[#111111] border border-[#1e1e1e] text-white px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5a5a] hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c9a84c] text-[#0a0a0a] py-4 text-xs font-bold tracking-[4px] uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[#5a5a5a] text-xs tracking-widest mt-6">
          No account?{" "}
          <Link
            href="/register"
            className="text-[#c9a84c] hover:text-white transition-colors"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
