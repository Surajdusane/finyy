import { JSX, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { Select } from "@/components/ui/select-custom";

export const useSelectAccount = (): [() => JSX.Element, () => Promise<unknown>] => {

  const accoutnQuery = useGetAccounts();
  const accountMuttation = useCreateAccount()
  const onCreateAccount = (name: string) => {
    accountMuttation.mutate({name})
  }
  const accountOptions = (accoutnQuery.data || []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);

  const selectValue = useRef<string | undefined>(undefined);

  const confirm = () =>
    new Promise((resolve, rejects) => {
      setPromise({ resolve });
    });

  const handleCloss = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleCloss();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleCloss();
  };

  const AccountDialoag = () => (
    <Dialog open={!!promise} onOpenChange={handleCloss}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>Please select an account to Continue</DialogDescription>
        </DialogHeader>
        <Select 
          placeholder="Select Account"
          options={accountOptions}
          onCreate={onCreateAccount}
          onChange={(value) => {
            selectValue.current = value;
          }}
          disabled={accoutnQuery.isLoading || accountMuttation.isPending}
        />
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [AccountDialoag, confirm];
};
