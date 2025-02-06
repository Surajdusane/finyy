import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { useGetCategory } from '../api/use-get-category'
import { useOpenCategory } from '../hooks/use-open-category';
import { useDeleteCategory } from '../api/use-delete-category';
import { useEditCategories } from '../api/use-edit-categories';
import { useConfirm } from "@/hooks/use-confirm";
import { useEffect } from 'react'

import { inserCategorySchema } from '@/db/schema'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import CategoryForm from './category-form'

const formSchema = inserCategorySchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

const EditCategorySheet = () => {

    const { isOpen, onClose, id } = useOpenCategory()

    const categoryQuery = useGetCategory(id)
    const deleteMutation = useDeleteCategory(id)
    const editMutation = useEditCategories(id)

    const [ConfirmationDialog, confirm] = useConfirm(
      "Are you sure you want to delete this category?",
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

    const isLoading = categoryQuery.isLoading 

    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data.name
    } : {
        name: ""
    }

  return (  
    <>
    <ConfirmationDialog />
    <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className='space-y-4'>
            <SheetHeader>
                <SheetTitle>Edit Category</SheetTitle>
                <SheetDescription>Edit an existing categroy</SheetDescription>
            </SheetHeader>
            {
                isLoading ? 
                <Loader2 className='animate-spin size-4 text-muted-foreground'/> : 
                <CategoryForm id={id} disabled={isPending} onSubmit={onSubmit} defaultValues={defaultValues} onDelete={onDelete} />
            } 
        </SheetContent>
    </Sheet>
    </>
  )
}

export default EditCategorySheet