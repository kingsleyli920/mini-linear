'use client';

import Script from 'next/script';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Interface for Google One Tap response
interface CredentialResponse {
  credential: string;
}

// Interface for Google Button configuration
interface GoogleButtonOptions {
  type: 'standard' | 'icon';
  theme: 'outline' | 'filled_blue' | 'filled_black';
  size: 'large' | 'medium' | 'small';
  text: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment: 'left' | 'center';
  width?: number | string;
  locale?: string;
}

// Add type definitions for window.google
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            nonce?: string;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: () => void;
          renderButton: (
            parent: HTMLElement,
            options: GoogleButtonOptions
          ) => void;
        };
      };
    };
  }
}

export function OneTapLogin() {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Generate nonce for security validation
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
    );
    const encoder = new TextEncoder();
    const encodedNonce = encoder.encode(nonce);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedNonce = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    return [nonce, hashedNonce];
  };

  // Initialize Google Sign-In
  const initializeGoogleSignIn = async () => {
    try {
      console.log('Initializing Google Sign-In');
      const [nonce, hashedNonce] = await generateNonce();
      console.log('Nonce generated');

      // Check for existing session
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        return;
      }
      if (data.session) {
        console.log('Existing session found, redirecting to issues');
        router.push('/issues');
        return;
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      console.log('Client ID:', clientId); // Debug log

      if (!clientId) {
        console.error('Google Client ID is not configured');
        return;
      }

      // Initialize Google Identity Services
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: CredentialResponse) => {
          try {
            setIsLoading(true);
            console.log('Received Google auth response');
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce,
            });

            if (error) throw error;
            console.log('Login successful:', data);
            router.push('/issues');
          } catch (error) {
            console.error('Google login error:', error);
            setIsLoading(false);
          }
        },
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
      });

      // Render the sign-in button
      if (buttonRef.current) {
        window.google?.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 280,
        });
      }
    } catch (error) {
      console.error('Google Sign-In initialization error:', error);
    }
  };

  useEffect(() => {
    // Initialize when the script is loaded
    const handleLoad = () => {
      if (window.google?.accounts) {
        initializeGoogleSignIn();
      }
    };

    // Check if the script is already loaded
    if (document.readyState === 'complete' && window.google?.accounts) {
      handleLoad();
    }

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, [router]);

  return (
    <div className="w-full flex flex-col items-center">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.google?.accounts) {
            initializeGoogleSignIn();
          }
        }}
      />
      <div
        ref={buttonRef}
        className={`${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  );
}
