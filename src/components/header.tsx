'use client'; 

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { createClient } from '@/lib/supabase/ssr-client'; 

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // listen to see if user logged out (automatic update)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

  checkSession();

  // 2. Then set up the listener for subsequent changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth Event:", event); // Useful for debugging
    if (session) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  });

  return () => subscription.unsubscribe();
}, [supabase]);

  // static lins
  const navLinks = [
    { name: 'About Us', href: '/about-us' },
    { name: 'Location Finder', href: '/locations' },
    { name: 'Resources', href: '/resources' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fffbea] animate-header-fade shadow-sm">
      <div className="flex items-center h-24 sm:h-32 px-6 md:px-12 w-full max-w-full justify-between">
        
        {/* logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
            <div className="flex-shrink-0">
              <Image 
                src="/images/logo.png" 
                alt="logo" 
                width={400} 
                height={400}
                className="!w-12 !h-12 sm:!w-16 !h-16 -translate-y-[4px] object-contain"
                priority 
              />
            </div>
          </Link>
          <h3 className="font-thin font-montserrat text-3xl text-[#3d9194] leading-none tracking-tighter ml-2">
            ada.
          </h3>
        </div>

        {/* nav section */}
        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-inter px-4 py-2 hover:text-white hover:bg-[#3d9194] text-[#3d9194] rounded-full transition-all whitespace-nowrap text-sm sm:text-base duration-300"
            >
              {link.name}    
            </Link>    
          ))}

          {/* dynamic section (changes user profile viewing) */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-[#3d9194]/20 pl-4 ml-2">
              <Link
                href="/favorites"
                className="font-inter px-4 py-2 bg-[#3d9194] text-white rounded-full transition-all whitespace-nowrap text-sm sm:text-base shadow-md hover:brightness-110"
              >
                My Favorites
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-[#3d9194] text-xs font-bold uppercase tracking-wider hover:underline ml-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="font-inter px-4 py-2 border-2 border-[#3d9194] text-[#3d9194] hover:bg-[#3d9194] hover:text-white rounded-full transition-all whitespace-nowrap text-sm sm:text-base duration-300 font-bold"
            >
              Your Account
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}