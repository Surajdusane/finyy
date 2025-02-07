import { inserTransactionSchema } from '@/db/schema';
import { z } from 'zod';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useCreateTransaction } from '../api/use-create-transaction';
import { useNewTransaction } from '../hooks/use-new-transaction';
import TransactionForm from './transaction-form';
import { Loader2 } from 'lucide-react';

const formSchema = inserTransactionSchema.omit({ id: true });

type FormValues = z.input<typeof formSchema>;

const NewTransactiontSheet = () => {
  const { isOpen, onClose } = useNewTransaction();

  const createMutaiton = useCreateTransaction();

  const categroryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({ name: name });
  };
  const categoryOptions = (categroryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accoutnQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => {
    accountMutation.mutate({ name: name });
  };
  const accountOptions = (accoutnQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const onSubmit = (values: FormValues) => {
    createMutaiton.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isPending =
    createMutaiton.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = categroryQuery.isPending || accoutnQuery.isLoading;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transsaction</SheetTitle>
          <SheetDescription>
            Create a new transaction to track yourt transactions
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
          </>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
            defaultValues={{
              date: new Date(),
              amount: '',
              payee: '',
              accountId: '',
              categoryId: '',
              notes: '',
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NewTransactiontSheet;
