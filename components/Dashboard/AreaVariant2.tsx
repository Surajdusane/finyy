"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Transactions",
  },
  desktop: {
    label: "Income",
    color: "#3d82f6", // Corrected color value
  },
  mobile: {
    label: "Expense",
    color: "#f43f5e", // Corrected color value
  },
} satisfies ChartConfig;

type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

export function AreaVariant2({ data }: Props) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <div className="">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="#3d82f6" // Corrected color value
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="#3d82f6" // Corrected color value
                stopOpacity={0.1}
              />
              no
            </linearGradient>
            <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="#f43f5e" // Corrected color value
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="#f43f5e" // Corrected color value
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="income"
            type="natural"
            fill="url(#income)"
            stroke="#3d82f6" // Corrected color value
            stackId="a"
          />
          <Area
            dataKey="expense"
            type="natural"
            fill="url(#expense)"
            stroke="#f43f5e" // Corrected color value
            stackId="a"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
