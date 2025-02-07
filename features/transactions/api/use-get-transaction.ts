import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import { convertAmountFromMilliunit } from '@/lib/utils';

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['transaction', { id }],
    queryFn: async () => {
      const response = await client.api.transactions[':id'].$get({
        param: {
          id: id,
        },
      });

      if (!response.ok) {
        throw new Error('Field to fetch transaction');
      }

      const { data } = await response.json();
      return { ...data, amount: convertAmountFromMilliunit(data.amount) };
    },
  });
  return query;
};
