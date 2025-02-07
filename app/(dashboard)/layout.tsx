import Header from '@/components/Global/Header';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main className="px-3 lg:px-14">{children}</main>
    </>
  );
};

export default layout;
