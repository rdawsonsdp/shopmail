'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === 'loading') {
    return (
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brown-sugar-brown"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="hidden sm:block text-sm text-brown-sugar-brown">
          {session.user?.name || session.user?.email}
        </div>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center px-3 py-2 border border-brown-sugar-brown shadow-sm text-sm font-medium rounded-md text-brown-sugar-brown bg-white hover:bg-brown-sugar-orange-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-sugar-orange"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="inline-flex items-center px-3 py-2 border border-brown-sugar-brown shadow-sm text-sm font-medium rounded-md text-brown-sugar-brown bg-white hover:bg-brown-sugar-orange-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-sugar-orange"
    >
      Sign In
    </button>
  );
}



