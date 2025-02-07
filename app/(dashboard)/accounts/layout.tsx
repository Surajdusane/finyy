import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Suspense fallback={<Loader2 className='size-8 animate-spin' />}>
        {children}
      </Suspense>
    </div>
  );
}
