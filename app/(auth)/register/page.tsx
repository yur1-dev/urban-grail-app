"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, CheckCircle2, ArrowLeft } from "lucide-react";

type Step = "form" | "otp" | "done";

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, name: form.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        setLoading(false);
        return;
      }
      setStep("otp");
      setResendTimer(60);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setOtpError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const next = [...otp];
    pasted.split("").forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Please enter the full 6-digit code");
      return;
    }
    setVerifying(true);
    setOtpError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || "Invalid or expired OTP");
        setVerifying(false);
        return;
      }
      setStep("done");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setOtpError("Verification failed. Try again.");
      setVerifying(false);
    }
  }

  async function handleResend() {
    if (resendTimer > 0) return;
    setOtpError("");
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, name: form.name }),
    });
    if (res.ok) setResendTimer(60);
    else setOtpError("Failed to resend. Try again.");
  }

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* ── STEP 1: FORM ── */}
        {step === "form" && (
          <>
            <p className="text-xs tracking-[5px] text-[#c9a84c] uppercase mb-3">
              Join the Culture
            </p>
            <h1 className="text-5xl font-black tracking-tight mb-10">
              REGISTER
            </h1>

            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="border border-red-800 bg-red-900/20 text-red-400 text-xs p-4">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs tracking-[3px] uppercase text-[#5a5a5a] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#111111] border border-[#1e1e1e] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
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
                  placeholder="Enter  email address"
                />
              </div>

              {/* Password + eye */}
              <div>
                <label className="block text-xs tracking-[3px] uppercase text-[#5a5a5a] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full bg-[#111111] border border-[#1e1e1e] text-white px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                    placeholder="Min. 6 characters"
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
                className="w-full bg-[#c9a84c] text-[#0a0a0a] py-4 text-xs font-bold tracking-[4px] uppercase hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Continue →"
                )}
              </button>
            </form>

            <p className="text-center text-[#5a5a5a] text-xs tracking-widest mt-8">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#c9a84c] hover:text-white transition-colors"
              >
                Login here
              </Link>
            </p>
          </>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === "otp" && (
          <>
            <button
              onClick={() => {
                setStep("form");
                setOtp(["", "", "", "", "", ""]);
                setOtpError("");
              }}
              className="flex items-center gap-2 text-xs text-[#5a5a5a] hover:text-white transition-colors mb-8 tracking-widest uppercase"
            >
              <ArrowLeft size={13} /> Back
            </button>

            <div className="flex items-center justify-center w-14 h-14 bg-[#c9a84c]/10 border border-[#c9a84c]/20 mb-6">
              <Mail size={24} className="text-[#c9a84c]" />
            </div>

            <p className="text-xs tracking-[5px] text-[#c9a84c] uppercase mb-3">
              Verify Email
            </p>
            <h1 className="text-4xl font-black tracking-tight mb-3">
              CHECK YOUR EMAIL
            </h1>
            <p className="text-[#5a5a5a] text-sm mb-1 leading-relaxed">
              We sent a 6-digit code to
            </p>
            <p className="text-white text-sm font-bold mb-8">{form.email}</p>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-xs tracking-[3px] uppercase text-[#5a5a5a] mb-4">
                  Enter 6-digit code
                </label>
                <div
                  className="flex gap-2 justify-between"
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-12 h-14 text-center text-xl font-black bg-[#111111] border-2 text-white focus:outline-none transition-all ${
                        digit
                          ? "border-[#c9a84c] text-[#c9a84c]"
                          : otpError
                            ? "border-red-500"
                            : "border-[#1e1e1e] focus:border-[#c9a84c]"
                      }`}
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-red-400 text-xs mt-2">{otpError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={verifying || otp.join("").length < 6}
                className="w-full bg-[#c9a84c] text-[#0a0a0a] py-4 text-xs font-bold tracking-[4px] uppercase hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#5a5a5a] mb-2">
                Didn't receive the code?
              </p>
              {resendTimer > 0 ? (
                <p className="text-xs text-[#3a3a3a]">
                  Resend in{" "}
                  <span className="text-[#c9a84c] font-bold tabular-nums">
                    {resendTimer}s
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-xs text-[#c9a84c] hover:text-white transition-colors underline tracking-widest uppercase"
                >
                  Resend Code
                </button>
              )}
            </div>
            <p className="text-center text-[#3a3a3a] text-[10px] tracking-widest mt-3">
              Check your spam folder if you don't see it.
            </p>
          </>
        )}

        {/* ── STEP 3: DONE ── */}
        {step === "done" && (
          <div className="text-center py-10">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 border border-green-500/30 mx-auto mb-6">
              <CheckCircle2 size={32} className="text-green-400" />
            </div>
            <p className="text-xs tracking-[5px] text-[#c9a84c] uppercase mb-3">
              Success
            </p>
            <h1 className="text-4xl font-black tracking-tight mb-4">
              WELCOME TO THE CULTURE
            </h1>
            <p className="text-[#5a5a5a] text-sm">
              Account created. Redirecting to login...
            </p>
            <div className="mt-6 w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
