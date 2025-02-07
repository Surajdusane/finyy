'use client';

import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteCategory } from '@/features/categories/api/use-delete-category';
import { useConfirm } from '@/hooks/use-confirm';

type ActionsProps = {
  id: string;
};

const Actions = ({ id }: ActionsProps) => {
  const [ConFirmationDialog, confirm] = useConfirm(
    'Are you sure you want to delete this category?',
    'This action cannot be undone.',
  );

  const deleteMutation = useDeleteCategory(id);

  const { onOpen } = useOpenCategory();

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {});
    }
  };

  return (
    <>
      <ConFirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'ghost'} className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Trash className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Actions;
