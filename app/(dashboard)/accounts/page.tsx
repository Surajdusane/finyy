'use client';

import { useBulkDeleteAccounts } from '@/features/accounts/api/use-bulk-delete-accounts';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';

import { DataTable } from '@/components/Table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Plus } from 'lucide-react';
import { columns } from './columns';
import { Suspense } from 'react';

const AccountsPage = () => {
  const { onOpen } = useNewAccount();
  const deleteAccounts = useBulkDeleteAccounts();
  const accountQuery = useGetAccounts();
  const accounts = accountQuery.data || [];

  const isDisabled = accountQuery.isLoading || deleteAccounts.isPending;

  if (accountQuery.isLoading) {
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

  return (
    <Suspense fallback={<Loader2 className='size-8 animate-spin' />}>
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts Page</CardTitle>
          <Button onClick={onOpen} size="sm">
            <Plus className="size-5" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={(row) => {
              const ids = row.map((row) => row.original.id);
              deleteAccounts.mutate({ ids });
            }}
            columns={columns}
            data={accounts}
            fileterKey="name"
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
    </Suspense>
  );
};

export default AccountsPage;
