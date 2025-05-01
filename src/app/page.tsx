import { Metadata } from 'next';
import Image from 'next/image';
import { LoginButton } from '@/components/auth/LoginButton';

export const metadata: Metadata = {
  title: 'Mini Linear - Login',
  description: 'A simplified version of Linear',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative h-12 w-12">
            <div className="absolute animate-spin rounded-full border-4 border-solid border-gray-200 border-t-transparent"></div>
          </div>
          <h1 className="text-2xl font-semibold">Log in to Linear</h1>
        </div>

        <div className="space-y-4">
          <LoginButton />

          <div className="text-center text-sm text-gray-500">
            <p>By continuing, you agree to Linear's</p>
            <div className="space-x-1">
              <a href="#" className="hover:text-gray-800">
                Terms of Service
              </a>
              <span>and</span>
              <a href="#" className="hover:text-gray-800">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
