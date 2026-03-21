"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, CheckCircle2, ArrowLeft, Lock } from "lucide-react";

type Step = "email" | "otp" | "reset" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [resetToken, setResetToken] = useState(""); // verified OTP stored for reset step
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [passError, setPassError] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ── Step 1: Send reset OTP ────────────────────────────────────────────────
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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

  // ── OTP input helpers ─────────────────────────────────────────────────────
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

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
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
      const res = await fetch("/api/auth/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || "Invalid or expired OTP");
        setVerifying(false);
        return;
      }
      setResetToken(code); // keep verified code for reset step
      setStep("reset");
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
    const res = await fetch("/api/auth/forgot-password/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) setResendTimer(60);
    else setOtpError("Failed to resend. Try again.");
  }

  // ── Step 3: Set new password ──────────────────────────────────────────────
  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (newPass.length < 6) {
      setPassError("Password must be at least 6 characters");
      return;
    }
    if (!/[A-Z]/.test(newPass)) {
      setPassError("Must include at least one uppercase letter");
      return;
    }
    if (!/[0-9]/.test(newPass)) {
      setPassError("Must include at least one number");
      return;
    }
    if (newPass !== confirmPass) {
      setPassError("Passwords do not match");
      return;
    }
    setResetting(true);
    setPassError("");
    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: resetToken, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPassError(data.error || "Reset failed");
        setResetting(false);
        return;
      }
      setStep("done");
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setPassError("Something went wrong. Try again.");
      setResetting(false);
    }
  }

  // Password strength
  const strength = (() => {
    let s = 0;
    if (newPass.length >= 6) s++;
    if (newPass.length >= 10) s++;
    if (/[A-Z]/.test(newPass)) s++;
    if (/[0-9]/.test(newPass)) s++;
    if (/[^A-Za-z0-9]/.test(newPass)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][
    strength
  ];
  const strengthColor = [
    "",
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-400",
    "bg-green-500",
  ][strength];

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* ── STEP 1: EMAIL ── */}
        {step === "email" && (
          <>
            <Link
              href="/login"
              className="flex items-center gap-2 text-xs text-[#5a5a5a] hover:text-white transition-colors mb-8 tracking-widest uppercase"
            >
              <ArrowLeft size={13} /> Back to Login
            </Link>

            <div className="flex items-center justify-center w-14 h-14 bg-[#c9a84c]/10 border border-[#c9a84c]/20 mb-6">
              <Lock size={22} className="text-[#c9a84c]" />
            </div>

            <p className="text-xs tracking-[5px] text-[#c9a84c] uppercase mb-3">
              Account Recovery
            </p>
            <h1 className="text-4xl font-black tracking-tight mb-3">
              FORGOT PASSWORD
            </h1>
            <p className="text-[#5a5a5a] text-sm mb-8 leading-relaxed">
              Enter your email and we'll send you a verification code to reset
              your password.
            </p>

            <form onSubmit={handleSendOtp} className="space-y-4">
              {error && (
                <div className="border border-red-800 bg-red-900/20 text-red-400 text-xs p-4">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs tracking-[3px] uppercase text-[#5a5a5a] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#111111] border border-[#1e1e1e] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#c9a84c] text-[#0a0a0a] py-4 text-xs font-bold tracking-[4px] uppercase hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Code →"
                )}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === "otp" && (
          <>
            <button
              onClick={() => {
                setStep("email");
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
              Enter Code
            </p>
            <h1 className="text-4xl font-black tracking-tight mb-3">
              CHECK YOUR EMAIL
            </h1>
            <p className="text-[#5a5a5a] text-sm mb-1">
              We sent a 6-digit code to
            </p>
            <p className="text-white text-sm font-bold mb-8">{email}</p>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-xs tracking-[3px] uppercase text-[#5a5a5a] mb-4">
                  Verification Code
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
                  "Verify Code →"
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
          </>
        )}

        {/* ── STEP 3: NEW PASSWORD ── */}
        {step === "reset" && (
          <>
            <div className="flex items-center justify-center w-14 h-14 bg-[#c9a84c]/10 border border-[#c9a84c]/20 mb-6">
              <Lock size={22} className="text-[#c9a84c]" />
            </div>

            <p className="text-xs tracking-[5px] text-[#c9a84c] uppercase mb-3">
              Almost Done
            </p>
            <h1 className="text-4xl font-black tracking-tight mb-8">
              SET NEW PASSWORD
            </h1>

            <form onSubmit={handleReset} className="space-y-5">
              {passError && (
                <div className="border border-red-800 bg-red-900/20 text-red-400 text-xs p-4">
                  {passError}
                </div>
              )}

              {/* New password */}
              <div>
                <label className="block text-xs tracking-[3px] uppercase text-[#5a5a5a] mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    value={newPass}
                    onChange={(e) => {
                      setNewPass(e.target.value);
                      setPassError("");
                    }}
                    className="w-full bg-[#111111] border border-[#1e1e1e] text-white px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5a5a] hover:text-white transition-colors"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength bar */}
                {newPass && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : "bg-[#1e1e1e]"}`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-[10px] ${["", "text-red-400", "text-orange-400", "text-yellow-400", "text-green-400", "text-green-400"][strength]}`}
                    >
                      {strengthLabel}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs tracking-[3px] uppercase text-[#5a5a5a] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConf ? "text" : "password"}
                    required
                    value={confirmPass}
                    onChange={(e) => {
                      setConfirmPass(e.target.value);
                      setPassError("");
                    }}
                    className={`w-full bg-[#111111] border text-white px-4 py-3 pr-12 text-sm focus:outline-none transition-colors ${
                      confirmPass && confirmPass !== newPass
                        ? "border-red-500"
                        : confirmPass && confirmPass === newPass
                          ? "border-green-500"
                          : "border-[#1e1e1e] focus:border-[#c9a84c]"
                    }`}
                    placeholder="Repeat new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConf(!showConf)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5a5a] hover:text-white transition-colors"
                  >
                    {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPass && confirmPass !== newPass && (
                  <p className="text-red-400 text-[11px] mt-1">
                    Passwords do not match
                  </p>
                )}
                {confirmPass && confirmPass === newPass && (
                  <p className="text-green-400 text-[11px] mt-1">
                    ✓ Passwords match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={resetting}
                className="w-full bg-[#c9a84c] text-[#0a0a0a] py-4 text-xs font-bold tracking-[4px] uppercase hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {resetting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password →"
                )}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 4: DONE ── */}
        {step === "done" && (
          <div className="text-center py-10">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 border border-green-500/30 mx-auto mb-6">
              <CheckCircle2 size={32} className="text-green-400" />
            </div>
            <p className="text-xs tracking-[5px] text-[#c9a84c] uppercase mb-3">
              Success
            </p>
            <h1 className="text-4xl font-black tracking-tight mb-4">
              PASSWORD RESET
            </h1>
            <p className="text-[#5a5a5a] text-sm">
              Your password has been updated. Redirecting to login...
            </p>
            <div className="mt-6 w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
