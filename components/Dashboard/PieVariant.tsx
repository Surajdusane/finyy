'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Cell, Label, Legend, Pie, PieChart } from 'recharts';

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
  total?: number;
};

const PieVariant = ({ data, total }: Props) => {
  // Define an array of colors you want to use
  const COLORS = ['#3b82f6', '#f43f5e', '#dfc13a', '#dbeafe'];

  const dataColor: { [key: string]: { label: string; color: string } } = {};
  data?.forEach((item, index) => {
    dataColor[item.name] = {
      label: item.name,
      color: COLORS[index % COLORS.length], // Use different colors from the array
    };
  });

  const chartConfig = {
    visitors: {
      label: 'Visitors',
    },
    ...dataColor,
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[350px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Legend />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={140}
          innerRadius={100}
          strokeWidth={5}
        >
          {/* Add cells to define the color for each segment */}
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {total?.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Spending
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

export default PieVariant;
