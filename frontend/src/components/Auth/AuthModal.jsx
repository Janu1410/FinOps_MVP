import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, Building2, ShieldCheck, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/Authstore.jsx";

const AuthModal = ({ isOpen, onClose, initialView = "login" }) => {
  const navigate = useNavigate();
  const { isSigningIn, signIn, isSigningUp, signUp, isVerifying, verifyEmail } = useAuthStore();

  // --- VIEW STATE ---
  const [view, setView] = useState(initialView); // 'login', 'signup', 'verify'
  const [emailForVerify, setEmailForVerify] = useState("");

  // --- FORM DATA ---
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "", // Default empty to force selection
    companyName: "",
    companyEmail: ""
  });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setLoginData({ email: "", password: "" });
      setSignupData({ fullName: "", email: "", password: "", role: "", companyName: "", companyEmail: "" });
      setOtp("");
      setShowPassword(false);
    }
  }, [isOpen, initialView]);

  // --- HANDLERS ---

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await signIn(loginData);
    if (response.success) {
      onClose();
      navigate("/upload");
    } else {
      if (response.status === 403) {
        setEmailForVerify(loginData.email);
        setView("verify");
      } else {
        alert(response.message || "Sign in failed");
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const payload = {
      full_name: signupData.fullName,
      email: signupData.email,
      password: signupData.password,
      role: signupData.role,
      client_name: signupData.companyName,
      client_email: signupData.companyEmail,
    };

    const response = await signUp(payload);

    if (response.success) {
      setEmailForVerify(signupData.email);
      setView("verify");
    } else {
      alert(response.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const response = await verifyEmail({ email: emailForVerify, otp });
    if (response.success) {
      alert("Email verified successfully! Please sign in.");
      setView("login");
    } else {
      alert(response.message || "Verification failed");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-[#121214] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-[#a02ff1] to-blue-500 z-20" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full z-20 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto custom-scrollbar p-6 sm:p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {view === "login" && "Welcome Back"}
                {view === "signup" && "Create Account"}
                {view === "verify" && "Verify OTP"}
              </h2>
              <p className="text-gray-400 text-sm">
                {view === "login" && "Sign in to your account to continue"}
                {view === "signup" && "Fill in your details to get started"}
                {view === "verify" && `Enter the code sent to ${emailForVerify}`}
              </p>
            </div>

            {/* --- LOGIN FORM --- */}
            {view === "login" && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email Address</label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none w-full"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Password</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none w-full"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-white/10 bg-[#0a0a0c] text-[#8B2FC9] focus:ring-[#8B2FC9]/20" />
                    <span className="ml-2 text-sm text-gray-400">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-[#8B2FC9] hover:text-white transition-colors font-medium">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="bg-[#8B2FC9] hover:bg-[#7a25b3] text-white font-bold rounded-xl py-3 shadow-[0_4px_14px_0_rgba(139,47,201,0.39)] w-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSigningIn ? "Signing in..." : "Sign In"}
                </button>

                <div className="mt-6 text-center border-t border-white/10 pt-6">
                  <p className="text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => setView("signup")} className="text-[#8B2FC9] hover:text-white font-bold transition-colors ml-1">
                      Sign up
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* --- SIGN UP FORM --- */}
            {view === "signup" && (
              <form onSubmit={handleSignup} className="space-y-5">
                
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">Personal Info</h3>
                  
                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({...signupData, [e.target.name]: e.target.value})}
                      required
                      className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] outline-none w-full"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, [e.target.name]: e.target.value})}
                      required
                      className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] outline-none w-full"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({...signupData, [e.target.name]: e.target.value})}
                          required
                          minLength={8}
                          className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] outline-none w-full pr-8"
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                          {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Role</label>
                      <select
                        name="role"
                        value={signupData.role}
                        onChange={(e) => setSignupData({...signupData, [e.target.name]: e.target.value})}
                        required
                        className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] outline-none w-full"
                      >
                        <option value="" disabled>Select</option>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">Company Info</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={signupData.companyName}
                        onChange={(e) => setSignupData({...signupData, [e.target.name]: e.target.value})}
                        className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] outline-none w-full"
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Company Email</label>
                      <input
                        type="email"
                        name="companyEmail"
                        value={signupData.companyEmail}
                        onChange={(e) => setSignupData({...signupData, [e.target.name]: e.target.value})}
                        className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2.5 px-3 focus:border-[#8B2FC9] outline-none w-full"
                        placeholder="contact@acme.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start">
                    <input type="checkbox" required className="mt-1 rounded border-white/10 bg-[#0a0a0c] text-[#8B2FC9] focus:ring-[#8B2FC9]/20" />
                    <span className="ml-2 text-xs text-gray-400">
                      I agree to the <span className="text-[#8B2FC9] cursor-pointer">Terms</span> and <span className="text-[#8B2FC9] cursor-pointer">Privacy Policy</span>
                    </span>
                  </label>
                  <label className="flex items-start mt-2">
                    <input type="checkbox" className="mt-1 rounded border-white/10 bg-[#0a0a0c] text-[#8B2FC9] focus:ring-[#8B2FC9]/20" />
                    <span className="ml-2 text-xs text-gray-400">Subscribe to newsletter</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="bg-[#8B2FC9] hover:bg-[#7a25b3] text-white font-bold rounded-xl py-3 shadow-[0_4px_14px_0_rgba(139,47,201,0.39)] w-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSigningUp ? "Creating Account..." : "Create Account"}
                </button>

                <div className="text-center mt-4">
                  <p className="text-gray-400 text-sm">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setView("login")} className="text-[#8B2FC9] hover:text-white font-bold transition-colors ml-1">
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* --- VERIFY FORM --- */}
            {view === "verify" && (
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#a02ff1]/10 rounded-full flex items-center justify-center text-[#a02ff1] mb-6 border border-[#a02ff1]/20">
                    <CheckCircle2 size={32} />
                  </div>
                  
                  <div className="w-full">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2 block text-center">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-4 px-4 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none w-full text-center text-2xl tracking-[0.5em] font-mono"
                      placeholder="••••••"
                      maxLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="bg-[#8B2FC9] hover:bg-[#7a25b3] text-white font-bold rounded-xl py-3 shadow-[0_4px_14px_0_rgba(139,47,201,0.39)] w-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </button>

                <div className="text-center">
                  <button type="button" onClick={() => setView("login")} className="text-sm text-gray-500 hover:text-white transition-colors">
                    Back to Login
                  </button>
                </div>
              </form>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;