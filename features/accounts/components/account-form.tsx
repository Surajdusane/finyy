'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { inserAccountSchema } from '@/db/schema';
import { useEffect, useRef } from 'react';

const formSchema = inserAccountSchema.pick({ name: true });

type FormValues = z.input<typeof formSchema>;

type FormProps = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit?: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: FormProps) => {
  const element = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (element.current) {
      element.current.focus();
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit?.(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4 pt-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={disabled}
                    placeholder="e.g, Cash, Bank, Investment"
                    {...field}
                    ref={element}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="w-full" disabled={disabled} type="submit">
            {id ? 'Save Changes' : 'Create Account'}
          </Button>
          {!!id && (
            <Button
              type="button"
              className="w-full"
              onClick={handleDelete}
              disabled={disabled}
              variant="outline"
            >
              <Trash className="size-4 mr-2" />
              Delete Account
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AccountForm;
