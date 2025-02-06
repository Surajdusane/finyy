import React from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

// Define interfaces for our data structures
interface DataItem {
  name: string;
  value: number;
  fill?: string;
}

interface RadialProps {
  data?: DataItem[];
  total?: number;
}

  

const Radial: React.FC<RadialProps> = ({ data = [], total = 100 }) => {
  const dataColor: { [key: string]: { label: string; color: string } } = {};
  const COLORS = ['#3b82f6', '#f43f5e', '#dfc13a', '#dbeafe'];
  data?.forEach((item, index) => {
    dataColor[item.name] = {
      label: item.name,
      color: COLORS[index % COLORS.length], // Use different colors from the array
    };
  });
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    ...dataColor
  } satisfies ChartConfig;
  // Define colors for the chart

  // Process data to add colors and calculate percentages
  const processedData: DataItem[] = data.map((item, index) => ({
    name: item.name,
    value: item.value,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
      <RadialBarChart 
        width={350}
        height={350}
        innerRadius="50%"
        outerRadius="100%"
        data={processedData}
        startAngle={90}
        endAngle={-270}
      >
        <RadialBar
         cornerRadius={15}
          endAngle={90}
          background
          dataKey="value"
          label={{ 
            position: 'insideStart',
            fill: '#fff',
            formatter: (value: number) => `${Math.round(value)}%`
          }}
        />
        <Legend
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="label" />}
        />
      </RadialBarChart>
    </ChartContainer>
  );
};

export default Radial;