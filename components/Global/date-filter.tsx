'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatDateRange } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

interface Period {
  from: Date;
  to: Date;
}

const DateFilter = () => {
  const router = useRouter();
  const pathName = usePathname();
  const params = useSearchParams();

  const accountId = params.get('accountId');
  const fromParam = params.get('from');
  const toParam = params.get('to');

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const initialDateRange: Period = {
    from: fromParam ? new Date(fromParam) : defaultFrom,
    to: toParam ? new Date(toParam) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(initialDateRange);
  const [isOpen, setIsOpen] = useState(false);

  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      from: dateRange?.from
        ? format(dateRange.from, 'yyyy-MM-dd')
        : format(defaultFrom, 'yyyy-MM-dd'),
      to: dateRange?.to
        ? format(dateRange.to, 'yyyy-MM-dd')
        : format(defaultTo, 'yyyy-MM-dd'),
      accountId,
    };

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

  const onReset = () => {
    const defaultDateRange: Period = {
      from: defaultFrom,
      to: defaultTo,
    };
    setDate(defaultDateRange);
    pushToUrl(defaultDateRange);
    setIsOpen(false);
  };

  const onApply = () => {
    if (date?.from && date?.to) {
      pushToUrl(date);
      setIsOpen(false);
    }
  };

  // Ensure we have a valid Period object for formatDateRange
  const getDisplayDateRange = (): Period => {
    if (date?.from && date?.to) {
      return { from: date.from, to: date.to };
    }
    return initialDateRange;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
        >
          <span>{formatDateRange(getDisplayDateRange())}</span>
          <ChevronDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="lg:w-auto w-full p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          className="p-3"
        />
        <div className="p-4 w-full flex items-center gap-x-2 border-t">
          <Button onClick={onReset} variant="outline" className="w-full">
            Reset
          </Button>
          <Button
            onClick={onApply}
            disabled={!date?.from || !date?.to}
            className="w-full"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
