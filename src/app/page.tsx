import { Metadata } from 'next';
import { OneTapLogin } from '@/components/auth/OneTapLogin';

export const metadata: Metadata = {
  title: 'Mini Linear - Login',
  description: 'A simplified version of Linear',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-2xl font-semibold">Log in to Mini Linear</h1>
        </div>

        <div className="space-y-6">
          <OneTapLogin />

          <div className="text-center text-sm text-gray-500">
            <p>By continuing, you agree to Mini Linear&apos;s</p>
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
