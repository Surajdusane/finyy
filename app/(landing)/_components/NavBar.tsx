'use client';
import HeaderLogo from '@/components/Global/HeaderLogo';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import Link from 'next/link';
import React from 'react';

const NavBar = () => {
    const { user } = useUser();
  return (
    <div className="py-4">
    <header className="sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all px-3 lg:px-0">
      <div className="container max-w-6xl flex h-14 items-center justify-between py-4">
        <div className="flex gap-6 md:gap-10">
        <HeaderLogo variant="blue" />
        </div>
        <div className="flex items-center space-x-3">
        {user ? (
          <Link href={'/overview'}>
            <Button className="text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background select-none bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-lg gap-2 px-4 md:flex">Dashboard</Button>
          </Link>
        ) : (
          <Link href={'/sign-in'}>
            <Button className="text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background select-none bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-lg gap-2 px-4 md:flex" >Login</Button>
          </Link>
        )}
        </div>
      </div>
    </header>
    </div>
  );
};

export default NavBar;
