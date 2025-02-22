'use client';

import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { Charts } from './Chart';
import { SpendigPi } from './SpendigPi';

const DataCharts = () => {
  const { data, isLoading } = useGetSummary();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-2 xl:col-span-4">
        <Charts data={data?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendigPi data={data?.categories} total={data?.expensesAmount} />
      </div>
    </div>
  );
};

export default DataCharts;
