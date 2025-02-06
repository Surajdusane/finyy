import { inserAccountSchema } from '@/db/schema'
import { z } from 'zod'
import { useNewAccount } from '../hooks/use-new-account'
import { useCreateAccount } from '../api/use-create-account'
import AccountForm from './account-form'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const formSchema = inserAccountSchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

const NewAccountSheet = () => {

    const { isOpen, onClose } = useNewAccount()

    const mutation = useCreateAccount()

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose()
            }
        })
    }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='space-y-4'>
            <SheetHeader>
                <SheetTitle>New Account</SheetTitle>
                <SheetDescription>Create a new account to track yourt transactions</SheetDescription>
            </SheetHeader>
            <AccountForm disabled={mutation.isPending} onSubmit={onSubmit} defaultValues={{name: ""}}/> 
        </SheetContent>
    </Sheet>
  )
}

export default NewAccountSheet