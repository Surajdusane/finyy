'use client';
import { AreaChart, BarChart, FileSearch } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import AreaVariant from './AreaVariant';
import { BarVariant } from './BarVariant';

type Props = {
  data?: {
    date: string;
    income: number;
    expense: number;
  }[];
};

export const Charts = ({ data = [] }: Props) => {
  const [charType, setCharType] = React.useState('area');
  const onTypeChange = (value: string) => {
    setCharType(value);
  };
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">Transactions</CardTitle>
        <Select defaultValue={charType} onValueChange={onTypeChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">AreChart</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">BarChart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-y-4 text-center h-[350px] w-full">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              No data available for this period
            </p>
          </div>
        ) : charType === 'bar' ? (
          <BarVariant data={data} />
        ) : (
          <AreaVariant data={data} />
        )}
      </CardContent>
    </Card>
  );
};
