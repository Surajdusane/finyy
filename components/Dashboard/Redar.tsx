"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RadarChart, PolarAngleAxis, Radar, PolarGrid, Legend } from "recharts";
import React from "react";

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
  total?: number;
};

const RadarChartComponent = ({ data, total }: Props) => {
  // Define an array of colors you want to use
  const COLORS = ['#3b82f6', '#f43f5e', '#dfc13a', '#dbeafe'];

  const dataColor: { [key: string]: { label: string; color: string } } = {};
  data?.forEach((item, index) => {
    dataColor[item.name] = {
      label: item.name,
      color: COLORS[index % COLORS.length],
    };
  });

  const chartConfig = {
    ...dataColor,
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[350px]  "
    >
      <RadarChart data={data} className="flex items-center h-full">
        <Legend  />
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <Radar
          name="Values"
          aria-setsize={5}
          dataKey="value"
          stroke={COLORS[0]}
          fill={COLORS[0]}
          fillOpacity={0.6}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="dot"
            />
          }
        />
      </RadarChart>
    </ChartContainer>
  );
};

export default RadarChartComponent;