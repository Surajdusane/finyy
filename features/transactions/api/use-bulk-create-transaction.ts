import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.transactions)['bulk-update']['$post']
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)['bulk-update']['$post']
>['json'];

export const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions['bulk-update']['$post']({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Transactions Created successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: (error) => {
      toast.error('Fialed to create transactions');
    },
  });

  return mutation;
};
