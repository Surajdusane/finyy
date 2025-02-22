import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[':id']['$patch']
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)[':id']['$patch']
>['json'];

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions[':id']['$patch']({
        param: { id: id },
        json,
      });
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success('Transaction updated successfully');
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: (error) => {
      toast.error('Fialed to edit transaction');
    },
  });

  return mutation;
};
