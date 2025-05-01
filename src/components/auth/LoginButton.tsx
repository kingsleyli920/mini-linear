'use client';

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { createOrUpdateUser } from '@/services/userService';

export function LoginButton() {
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/issues`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

      // 监听认证状态变化，保存用户信息
      const authListener = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            await createOrUpdateUser(session.user);
            authListener.data.subscription.unsubscribe();
          }
        }
      );
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
    >
      <Image src="/google.svg" alt="Google logo" width={18} height={18} />
      使用Google账号继续
    </button>
  );
}
