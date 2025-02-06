import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import AccountForm from './account-form'
import { useOpenAccount } from '../hooks/use-open-account'
import { useEditAccount } from '../api/use-edit-account'
import { useGetAccount } from '../api/use-get-account'
import { useDeleteAccount } from '../api/use-delete-account'
import { useConfirm } from "@/hooks/use-confirm";

import { inserAccountSchema } from '@/db/schema'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useEffect } from 'react'

const formSchema = inserAccountSchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

const EditAccountSheet = () => {

    const { isOpen, onClose, id } = useOpenAccount()

    const accountQuery = useGetAccount(id)
    const editMutation = useEditAccount(id)
    const deleteMutation = useDeleteAccount(id)

    const [ConfirmationDialog, confirm] = useConfirm(
      "Are you sure you want to delete this account?",
      "This action cannot be undone."
    );

    const onDelete = async () => {
        const ok = await confirm()

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose()
                }
            })
        }
    }

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }
    const isPending = editMutation.isPending || deleteMutation.isPending

    const isLoading = accountQuery.isLoading 

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : {
        name: ""
    }

  return (  
    <>
    <ConfirmationDialog />
    <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='space-y-4'>
            <SheetHeader>
                <SheetTitle>Edit Account</SheetTitle>
                <SheetDescription>Edit an existing account</SheetDescription>
            </SheetHeader>
            {
                isLoading ? 
                <Loader2 className='animate-spin size-4 text-muted-foreground'/> : 
                <AccountForm id={id} disabled={isPending} onSubmit={onSubmit} defaultValues={defaultValues} onDelete={onDelete} />
            } 
        </SheetContent>
    </Sheet>
    </>
  )
}

export default EditAccountSheet