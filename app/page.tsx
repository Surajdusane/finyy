import Faq from '@/components/Global/FaQ';
import Herosec from '@/components/Global/Herosec';
import NavBar from '@/components/Global/NavBar';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<Loader2 className='size-8 animate-spin' />}>
    <div className="bg-[#f9fafb]">
      <NavBar />
      <Herosec />
      <Faq />
    </div>
    </Suspense>
  );
};

export default page;
