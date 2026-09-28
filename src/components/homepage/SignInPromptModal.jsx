import { useState, useRef } from "react";
import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { BASE_URL } from "../../api/api";
import authFandomBg from "../../assets/images/auth_fandom_bg.png";

const SignInPromptModal = ({
  isOpen,
  onClose,
  initialMode = "login",
  onSuccess,
  onOpenAdmin,
}) => {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  if (!isOpen) return null;

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setErrorMsg("");
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setErrorMsg("");

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (mode === "login") {
      if (!email || !password) {
        setErrorMsg("Please enter both email and password.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || "Invalid email or password.");
          setLoading(false);
          return;
        }

        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setLoading(false);
        onClose();
        if (data.user?.role === "admin" && onOpenAdmin) {
          onOpenAdmin(data.user);
        } else if (onSuccess) {
          onSuccess(data.user);
        }
      } catch (err) {
        setErrorMsg("Network error. Please check if backend server is running.");
        setLoading(false);
      }
      return;
    }

    if (mode === "signup") {
      if (!name || !email || !password) {
        setErrorMsg("Please fill in all required fields.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || "Failed to create account.");
          setLoading(false);
          return;
        }

        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setSuccessMsg("Account created successfully!");
        setIsSubmitted(true);
        setLoading(false);

        setTimeout(() => {
          setIsSubmitted(false);
          onClose();
          if (onSuccess) {
            onSuccess(data.user);
          }
        }, 900);
      } catch (err) {
        setErrorMsg("Network error. Please check if backend server is running.");
        setLoading(false);
      }
      return;
    }

    if (mode === "forgot") {
      if (!email) {
        setErrorMsg("Please enter your registered email.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || "Email not found.");
          setLoading(false);
          return;
        }

        setOtp(["", "", "", ""]);
        setMode("otp");
        setLoading(false);
      } catch (err) {
        setErrorMsg("Network error. Could not request OTP.");
        setLoading(false);
      }
      return;
    }

    if (mode === "otp") {
      const code = otp.join("");
      if (code.length < 4) {
        setErrorMsg("Please enter the complete 4-digit code.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            otp: code,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || "Invalid or expired verification code.");
          setLoading(false);
          return;
        }

        setMode("reset_password");
        setLoading(false);
      } catch (err) {
        setErrorMsg("Network error verifying code.");
        setLoading(false);
      }
      return;
    }

    if (mode === "reset_password") {
      if (!newPassword || !confirmPassword) {
        setErrorMsg("Please fill in both password fields.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg("Passwords do not match. Please try again.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.join(""),
            newPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || "Failed to reset password.");
          setLoading(false);
          return;
        }

        setSuccessMsg("Your password has been changed. You can now log in.");
        setIsSubmitted(true);
        setLoading(false);

        setTimeout(() => {
          setIsSubmitted(false);
          setMode("login");
          setPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setOtp(["", "", "", ""]);
        }, 1200);
      } catch (err) {
        setErrorMsg("Network error while resetting password.");
        setLoading(false);
      }
    }
  };

  const handleUserQuickSwitch = () => {
    setEmail("user@fanhub.com");
    setPassword("Password123!");
    setErrorMsg("");
    setMode("login");
  };

  const handleAdminQuickSwitch = () => {
    setEmail("admin@fanhub.com");
    setPassword("AdminPassword123!");
    setErrorMsg("");
    setMode("login");
  };

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setErrorMsg("Google Sign-In is not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env");
      return;
    }

    const redirectUri = window.location.origin;
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=openid%20email%20profile&prompt=select_account&nonce=fanhub`;

    const popup = window.open(googleOAuthUrl, "google_login", "width=500,height=600,left=400,top=100");

    const checkInterval = setInterval(async () => {
      try {
        if (!popup || popup.closed) {
          clearInterval(checkInterval);
          return;
        }
        const popupUrl = popup.location.href;
        if (popupUrl.includes("access_token") || popupUrl.includes("id_token")) {
          clearInterval(checkInterval);
          const hashParams = new URLSearchParams(popupUrl.split("#")[1]);
          const idToken = hashParams.get("id_token") || hashParams.get("access_token");
          popup.close();

          if (idToken) {
            setLoading(true);
            try {
              const res = await fetch(`${BASE_URL}/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: idToken })
              });
              const data = await res.json();
              if (!res.ok) {
                setErrorMsg(data.message || "Google login failed.");
                setLoading(false);
                return;
              }
              if (data.token) localStorage.setItem("token", data.token);
              if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
              setLoading(false);
              onClose();
              if (data.user?.role === "admin" && onOpenAdmin) {
                onOpenAdmin(data.user);
              } else if (onSuccess) {
                onSuccess(data.user);
              }
            } catch {
              setErrorMsg("Network error during Google login.");
              setLoading(false);
            }
          }
        }
      } catch {
        // cross-origin error means user hasn't redirected yet
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden select-none font-sans">
      {/* Auth background - clear image, subtle overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={authFandomBg}
          alt="Fandom Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md px-4 py-6 text-white animate-in fade-in duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-2 right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white transition-all cursor-pointer active:scale-90"
        >
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 size={48} className="text-[#FF5F1F] mx-auto animate-bounce" />
            <h3 className="text-2xl font-extrabold text-white">
              {successMsg}
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              Updating your session...
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                {mode === "login" && "Welcome Back"}
                {mode === "signup" && "Create Account"}
                {mode === "forgot" && "Forgot Password"}
                {mode === "otp" && "Verify Code"}
                {mode === "reset_password" && "Reset Password"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                {mode === "login" && "Log in to continue your fandom journey"}
                {mode === "signup" && "Sign up to join the FanHub community"}
                {mode === "forgot" && "Enter your email to receive a 4-digit code"}
                {mode === "otp" && `Enter the 4-digit code sent to ${email || "your email"}`}
                {mode === "reset_password" && "Enter a new strong password for your account"}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-red-500/20 border border-red-400/40 text-red-200 text-xs font-semibold flex items-center gap-2 backdrop-blur-md">
                <AlertCircle size={16} className="shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="text-left">
                  <label className="text-xs font-semibold text-slate-200 block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="Enter your name"
                    className="w-full h-11 px-5 rounded-full bg-white/10 border border-white/25 focus:bg-white/20 focus:border-white/60 text-sm font-medium text-white placeholder:text-slate-300/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-xl transition-all outline-none"
                  />
                </div>
              )}

              {(mode === "login" || mode === "signup" || mode === "forgot") && (
                <div className="text-left">
                  <label className="text-xs font-semibold text-slate-200 block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="Enter your email"
                    className="w-full h-11 px-5 rounded-full bg-white/10 border border-white/25 focus:bg-white/20 focus:border-white/60 text-sm font-medium text-white placeholder:text-slate-300/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-xl transition-all outline-none"
                  />
                </div>
              )}

              {(mode === "login" || mode === "signup") && (
                <div className="text-left">
                  <label className="text-xs font-semibold text-slate-200 block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="Enter your password"
                    className="w-full h-11 px-5 rounded-full bg-white/10 border border-white/25 focus:bg-white/20 focus:border-white/60 text-sm font-medium text-white placeholder:text-slate-300/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-xl transition-all outline-none"
                  />
                  {mode === "login" && (
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={() => handleModeChange("forgot")}
                        className="text-xs font-medium text-slate-300 hover:text-white hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {mode === "otp" && (
                <div className="py-2">
                  <label className="text-xs font-semibold text-slate-200 block mb-2 text-center">
                    4-Digit Verification Code
                  </label>
                  <div className="flex items-center justify-center gap-3">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-12 text-center text-xl font-bold rounded-2xl bg-white/10 border border-white/25 focus:bg-white/20 focus:border-white/60 text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-xl transition-all outline-none"
                      />
                    ))}
                  </div>
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="text-xs font-medium text-slate-300 hover:text-white hover:underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              )}

              {mode === "reset_password" && (
                <>
                  <div className="text-left">
                    <label className="text-xs font-semibold text-slate-200 block mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrorMsg("");
                      }}
                      placeholder="Enter new password"
                      className="w-full h-11 px-5 rounded-full bg-white/10 border border-white/25 focus:bg-white/20 focus:border-white/60 text-sm font-medium text-white placeholder:text-slate-300/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-xl transition-all outline-none"
                    />
                  </div>
                  <div className="text-left">
                    <label className="text-xs font-semibold text-slate-200 block mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrorMsg("");
                      }}
                      placeholder="Confirm new password"
                      className="w-full h-11 px-5 rounded-full bg-white/10 border border-white/25 focus:bg-white/20 focus:border-white/60 text-sm font-medium text-white placeholder:text-slate-300/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-xl transition-all outline-none"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 sm:h-12 bg-[#FFA800] hover:bg-[#E69500] disabled:opacity-60 text-black font-bold text-sm tracking-wide rounded-full shadow-lg transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 mt-2"
              >
                {loading && <Loader2 size={16} className="animate-spin text-black" />}
                {mode === "login" && (loading ? "Logging in..." : "Log In")}
                {mode === "signup" && (loading ? "Creating account..." : "Sign Up")}
                {mode === "forgot" && (loading ? "Sending code..." : "Send Verification Code")}
                {mode === "otp" && "Verify Code"}
                {mode === "reset_password" && (loading ? "Saving..." : "Save New Password")}
              </button>

              {(mode === "login" || mode === "signup") && (
                <>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex-1 h-px bg-white/20" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
                    <div className="flex-1 h-px bg-white/20" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-11 sm:h-12 bg-white hover:bg-gray-100 disabled:opacity-60 text-gray-800 font-bold text-sm tracking-wide rounded-full shadow-lg transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-3 mt-3"
                  >
                    <svg width="18" height="18" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </>
              )}
            </form>

            <div className="text-center text-xs font-semibold text-slate-300 mt-5 sm:mt-6">
              {mode === "login" && (
                <span>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeChange("signup")}
                    className="font-bold text-white hover:underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </span>
              )}

              {mode === "signup" && (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeChange("login")}
                    className="font-bold text-white hover:underline cursor-pointer"
                  >
                    Log in
                  </button>
                </span>
              )}

              {(mode === "forgot" || mode === "otp" || mode === "reset_password") && (
                <button
                  type="button"
                  onClick={() => handleModeChange("login")}
                  className="font-bold text-white hover:underline cursor-pointer"
                >
                  ← Back to Log In
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { SignInPromptModal };
