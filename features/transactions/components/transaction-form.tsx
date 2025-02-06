"use client"

import { useEffect, useRef } from "react";
import { useCreateTransaction } from "../api/use-create-transaction";
import { useNewTransaction } from "../hooks/use-new-transaction";

import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select-custom";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { AmountInput } from "@/components/ui/amount-input";
import { inserTransactionSchema } from "@/db/schema";
import { convertAmountIntoMilliunit } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee : z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
})

const apiSchema = inserTransactionSchema.omit({ id: true });

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.infer<typeof apiSchema>;

type FormProps = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions?: { value: string; label: string }[];
  categoryOptions?: { value: string; label: string }[];
  onCreateAccount?: (name: string) => void;
  onCreateCategory?: (name: string) => void;
};

const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: FormProps) => {
    const element = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if(element.current){
            element.current.focus()
        }
    },[]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    const amountmu = convertAmountIntoMilliunit(parseFloat(values.amount));
    onSubmit({ 
      ...values, 
      amount: amountmu 
    });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4">
        <FormField
            name="date"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker 
                    value={field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="accountId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account</FormLabel>
                <FormControl>
                <Select 
                  {...field}
                  placeholder="Select an Account" 
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  onChange={field.onChange}
                  disabled={disabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                <Select 
                  {...field}
                  placeholder="Select an Category"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  onChange={field.onChange}
                  disabled={disabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="payee"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payee</FormLabel>
                <FormControl>
                <Input 
                  disabled={disabled}
                  placeholder="Enter a payee"
                  {...field}
                />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ""}
                disabled={disabled}
                placeholder="Opetional notes"
              />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
              <AmountInput 
                {...field}
                disabled={disabled}
                placeholder="0.00"
              />
              </FormControl>
            </FormItem>
          )}
        />
          <Button className="w-full" disabled={disabled} type="submit">
            {defaultValues?.amount ? "Save Changes" : "Create Transaction"}
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
            Delete transaction
          </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default TransactionForm;
