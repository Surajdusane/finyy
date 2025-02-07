"use client";

import DataCharts from '@/components/Dashboard/DataCharts';
import DataGrid from '@/components/Dashboard/DataGrid';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

const DashboardPage = () => {
  return (
    <Suspense fallback={<Loader2 className='size-8 animate-spin' />}>
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      <DataCharts />
    </div>
    </Suspense>
  );
};

export default DashboardPage;
