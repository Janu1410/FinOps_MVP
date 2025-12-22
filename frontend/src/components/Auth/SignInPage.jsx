
import { useNavigate } from "react-router-dom";
import { useState  } from "react";
import {Link} from "react-router-dom";
import AuthLayout from "./AuthLayout.jsx";
import { useAuthStore } from "../../store/Authstore.jsx";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isSigningIn, signIn , user} = useAuthStore(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await signIn({ email, password });
    if (response.success) {
      // Redirect to dashboard or desired page after successful sign-in
       navigate("/upload");
      return;
    } else {
      if(response.status == 403){
        navigate("/verify-email/" + email);
        return;
      }
      alert(response.message || "Sign in failed");
    }
  };

  return (
    <AuthLayout title="Sign In">
      <div className="min-h-screen flex items-center justify-center  p-4">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-[#121214] border border-white/10 shadow-2xl rounded-3xl w-full p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-sm">
                Sign in to your account to continue
              </p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2 px-3 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none w-full"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2 px-3 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none w-full"
                  placeholder="••••••••"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-white/10 bg-[#0a0a0c] text-[#8B2FC9] focus:ring-[#8B2FC9]/20"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#8B2FC9] hover:text-white transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSigningIn}
                className="bg-[#8B2FC9] hover:bg-[#7a25b3] text-white font-bold rounded-xl py-3 shadow-[0_4px_14px_0_rgba(139,47,201,0.39)] w-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSigningIn ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-white/10"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t border-white/10"></div>
            </div>

           
            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-[#8B2FC9] hover:text-white font-bold transition-colors ml-1"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
