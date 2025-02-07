'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  income: {
    label: 'Income',
    color: '#3d82f6',
  },
  expense: {
    label: 'Expense',
    color: '#f43f5e',
  },
} satisfies ChartConfig;

type Props = {
  data: {
    date: string;
    income: number;
    expense: number;
  }[];
};

export function BarVariant({ data }: Props) {
  data = data.slice(-7);
  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[350px] w-full"
      >
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
                indicator="dot"
              />
            }
          />
          <Bar dataKey="income" fill="#3d82f6" radius={4} />
          <Bar dataKey="expense" fill="#f43f5e" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
