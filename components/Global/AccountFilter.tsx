'use client';

import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetSummary } from '@/features/summary/api/use-get-summary';

const AccountFilter = () => {
  const router = useRouter();
  const pathName = usePathname();

  const onChange = (value: string) => {
    const query = {
      accountId: value,
      from: from,
      to: to,
    };
    if (value === 'all') {
      query.accountId = '';
    }
    const url = qs.stringifyUrl(
      {
        url: pathName,
        query,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      },
    );
    router.push(url);
  };

  const params = useSearchParams();
  const accountId = params.get('accountId') || 'all';
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const { isLoading: isLodingSummary } = useGetSummary();
  const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts();
  return (
    <Select
      value={accountId}
      onValueChange={onChange}
      disabled={isLoadingAccounts || isLodingSummary}
    >
      <SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All accounts</SelectItem>
        {accounts?.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AccountFilter;
