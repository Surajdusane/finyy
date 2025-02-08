'use client';

import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transaction';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';

import { Loader2, Plus } from 'lucide-react';

import { DataTable } from '@/components/Table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { transactions as transactionSchema } from '@/db/schema';
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transaction';
import { useSelectAccount } from '@/features/transactions/hooks/use-select-account';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';
import { columns } from './columns';
import ImportCard from './import-card';
import { UploadButton } from './upload-button';

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_RESULT = {
  data: [],
  error: [null],
  meta: {},
};

const TransactionPag = () => {
  const [AccountDialoag, confirm] = useSelectAccount();

  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);

  const [importResult, setImportResult] = useState<
    typeof INITIAL_IMPORT_RESULT
  >(INITIAL_IMPORT_RESULT);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULT) => {
    console.log(results);
    setImportResult(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResult(INITIAL_IMPORT_RESULT);
    setVariant(VARIANTS.LIST);
  };

  const newTransaction = useNewTransaction();
  const createTransaction = useBulkCreateTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactionQuery = useGetTransactions();
  const transactions = transactionQuery.data || [];

  const isDisabled = transactionQuery.isLoading || deleteTransactions.isPending;

  const onSubmitImport = async (
    values: (typeof transactionSchema.$inferInsert)[],
  ) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error('Please select an account to continue');
    }
    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    createTransaction.mutate(data, {
      onSuccess: () => {
        toast.success('Transactions created successfully');
        onCancelImport();
      },
    });
  };

  if (transactionQuery.isLoading) {
    return (
      <Suspense fallback={<Loader2 className='size-8 animate-spin' />}>
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
      </Suspense>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
      <Suspense fallback={<Loader2 className='size-8 animate-spin' />}>
        <AccountDialoag />
        <ImportCard
          data={importResult.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </Suspense>
      </>
    );
  }

  return (
    <Suspense fallback={<Loader2 className='size-8 animate-spin' />}>
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex items-center flex-col lg:flex-row gap-y-2 gap-x-2">
            <Button
              className="w-full lg:w-auto"
              onClick={newTransaction.onOpen}
              size="sm"
            >
              <Plus className="size-5" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={(row) => {
              const ids = row.map((row) => row.original.id);
              deleteTransactions.mutate({ ids });
            }}
            columns={columns}
            data={transactions}
            fileterKey="payee"
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
    </Suspense>
  );
};

export default function TransactionPage() {
  return (
    <Suspense fallback={<Loader2 className='size-8 animate-spin' />}>
      <TransactionPag />
    </Suspense>
  )
};
