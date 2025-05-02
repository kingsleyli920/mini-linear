import { createClient } from "@/lib/supabase/client";

export default function GoogleLoginButton() {
  const supabase = createClient();
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };
  return (
    <button
      onClick={handleLogin}
      className="btn-primary w-full py-10 flex items-center justify-center gap-3 mb-2 border border-[#393943] shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
    >
      <svg width="22" height="22" viewBox="0 0 48 48" className="inline-block">
        <g>
          <path
            fill="#4285F4"
            d="M24 9.5c3.54 0 6.7 1.22 9.19 3.61l6.85-6.85C35.91 2.7 30.36 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.2C12.36 13.13 17.73 9.5 24 9.5z"
          />
          <path
            fill="#34A853"
            d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"
          />
          <path
            fill="#FBBC05"
            d="M10.67 28.29A14.5 14.5 0 0 1 9.5 24c0-1.49.26-2.93.72-4.29l-7.98-6.2A23.93 23.93 0 0 0 0 24c0 3.93.94 7.65 2.61 10.93l8.06-6.64z"
          />
          <path
            fill="#EA4335"
            d="M24 48c6.36 0 11.71-2.1 15.62-5.72l-7.19-5.6c-2.01 1.35-4.59 2.16-8.43 2.16-6.27 0-11.64-3.63-13.33-8.79l-8.06 6.64C6.71 42.18 14.82 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </g>
      </svg>
      Sign in with Google
    </button>
  );
}
