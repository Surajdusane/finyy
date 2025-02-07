import { inserCategorySchema } from '@/db/schema';
import { z } from 'zod';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import CategoryForm from './category-form';
import { useCreateCategory } from '../api/use-create-category';
import { useNewCategory } from '../hooks/use-new-category';

const formSchema = inserCategorySchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();

  const mutation = useCreateCategory();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your categroy
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          disabled={mutation.isPending}
          onSubmit={onSubmit}
          defaultValues={{ name: '' }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default NewCategorySheet;
