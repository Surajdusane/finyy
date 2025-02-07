import { useConfirm } from '@/hooks/use-confirm';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useGetTransaction } from '../api/use-get-transaction';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { useOpenTransaction } from '../hooks/use-open-transaction';
import { useEditTransaction } from '../api/use-edit-transaction';
import { useDeleteTransaction } from '../api/use-delete-transaction';
import { inserTransactionSchema } from '@/db/schema';

import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import TransactionForm from './transaction-form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const formSchema = inserTransactionSchema.omit({ id: true });

type FormValues = z.input<typeof formSchema>;

const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const transactionQuiery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const [ConfirmationDialog, confirm] = useConfirm(
    'Are you sure you want to delete this transaction?',
    'This action cannot be undone.',
  );

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

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending ||
    transactionQuiery.isLoading;

  const isLoading =
    transactionQuiery.isLoading ||
    categroryQuery.isLoading ||
    accoutnQuery.isLoading;

  const defaultValues = transactionQuiery.data
    ? {
        accountId: transactionQuiery.data.accountId,
        amount: transactionQuiery.data.amount.toString(),
        categoryId: transactionQuiery.data.categoryId,
        payee: transactionQuiery.data.payee,
        date: transactionQuiery.data.date
          ? new Date(transactionQuiery.data.date)
          : new Date(),
        notes: transactionQuiery.data.notes,
      }
    : {
        accountId: '',
        amount: '',
        categoryId: '',
        payee: '',
        date: new Date(),
        notes: '',
      };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <Loader2 className="animate-spin size-4 text-muted-foreground" />
          ) : (
            <TransactionForm
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default EditTransactionSheet;
