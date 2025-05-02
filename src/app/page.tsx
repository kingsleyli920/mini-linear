'use client';

import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import DummyButton from "@/components/common/DummyButton";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#18181b]">
      <div className="flex flex-col items-center space-y-6 w-full max-w-md px-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#6366f1] to-[#818cf8]">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#fff" /><path d="M8 20L24 12" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" /><path d="M10 24L22 8" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Log in to Mini Linear</h1>
        <div className="flex flex-col gap-4 w-full">
          <GoogleLoginButton />
          <DummyButton>Continue with email</DummyButton>
          <DummyButton>Continue with SAML SSO</DummyButton>
          <DummyButton>Log in with Passkey</DummyButton>
        </div>
        <div className="text-center text-sm text-gray-400 pt-2 w-full">
          Don&apos;t have an account?{' '}
          <a href="#" className="text-[#818cf8] hover:underline">Sign up</a>{' '}
          or{' '}
          <a href="#" className="text-[#818cf8] hover:underline">Learn more</a>
        </div>
      </div>
    </main>
  );
}
