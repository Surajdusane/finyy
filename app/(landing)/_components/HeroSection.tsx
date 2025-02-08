import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const HeroSection = () => {
  return (
    <section className="space-y-6 py-8 sm:py-16 lg:py-10">
      <div className="flex flex-col items-center justify-center gap-y-4 ">
        <Button variant={'outline'} size={'sm'}>
          🎉 Free Finance mangement app
        </Button>
        <div className='px-4 md:px-8 lg:px-24 flex justify-center items-center py-4'>
        <h1 className="text-center font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]">
        Simplify Your Transactions
        <br />
          <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Manage with Ease
          </span>
        </h1>
        </div>
        <p className="mx-auto mb-3 mt-4 max-w-xl text-pretty text-center dark:text-gray-400 text-sm md:text-lg">
          Streamline and track all your business transactions in one place,
          ensuring accuracy, security, and efficiency every step of the way.
        </p>
        <div>
          <div className="flex justify-center items-center px-8 gap-4 mt-10">
            <Link href={'/sign-in'}>
              <Button
                variant="outline"
                className="px-6 py-6 font-medium text-lg"
              >
                Sign In
              </Button>
            </Link>
            <Link href={'/overview'}>
              <Button className="px-6 py-6 font-medium text-lg">
                Get Sarted
              </Button>
            </Link>
          </div>
          <div className="mx-auto my-4 h-[1.7px] w-full max-w-xl bg-gradient-to-r from-transparent via-gray-800 to-transparent dark:via-white md:my-8"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
