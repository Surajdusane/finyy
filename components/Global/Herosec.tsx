import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';

const Herosec = () => {
  return (
    <div className="px-2 md:py-24 lg:py-32">
      <div>
        <div>
          <h1 className="h1 mt-10 text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl xl:text-7xll">
            Simplify Your Transactions. Manage with Ease.
          </h1>
          <p className="mx-auto mb-3 mt-4 max-w-xl text-pretty text-center dark:text-gray-400 text-sm md:text-lg">
            Streamline and track all your business transactions in one place,
            ensuring accuracy, security, and efficiency every step of the way.
          </p>
        </div>
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
                Get Started
              </Button>
            </Link>
          </div>
          <div className="mx-auto my-4 h-[1.7px] w-full max-w-xl bg-gradient-to-r from-transparent via-gray-800 to-transparent dark:via-white md:my-8 lg:mb-20"></div>
        </div>
        <div>
          <div className="flex justify-center items-center px-8">
            <Image
              src="/hero.png"
              width={1000}
              height={1000}
              alt="heroimage"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Herosec;
