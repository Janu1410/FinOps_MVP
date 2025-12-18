import React from 'react';
import { SignIn } from "@clerk/clerk-react";
import AuthLayout from './AuthLayout';

const SignInPage = () => {
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to access your FinOps dashboard."
    >
      <SignIn 
        path="/sign-in"
        signUpUrl="/sign-up" // Link to swap to sign up
        forceRedirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-[#121214] border border-white/10 shadow-2xl rounded-3xl w-full p-8",
            headerTitle: "hidden", // We hide Clerk's title because we added our own in AuthLayout
            headerSubtitle: "hidden",
            socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl h-10",
            formFieldLabel: "text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1",
            formFieldInput: "bg-[#0a0a0c] border border-white/10 text-white rounded-xl py-2 px-3 focus:border-[#8B2FC9] focus:ring-[#8B2FC9]/20 outline-none",
            formButtonPrimary: "bg-[#8B2FC9] hover:bg-[#7a25b3] text-white font-bold rounded-xl py-3 shadow-[0_4px_14px_0_rgba(139,47,201,0.39)]",
            footerActionText: "text-gray-400 text-sm",
            footerActionLink: "text-[#8B2FC9] hover:text-white font-bold transition-colors ml-1"
          }
        }}
      />
    </AuthLayout>
  );
};

export default SignInPage;