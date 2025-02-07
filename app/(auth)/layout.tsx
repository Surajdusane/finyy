import React from 'react';
import Image from 'next/image';

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="flex items-center justify-between h-screen">
      <div className="h-full w-full md:w-1/2 flex justify-center items-center">
        {children}
      </div>
      <div className="h-full w-1/2 hidden md:flex justify-center items-center bg-blue-600">
        <Image src="/logo.svg" alt="logo" width={200} height={200} />
      </div>
    </div>
  );
};

export default layout;
