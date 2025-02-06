"use client"
import { FileChartPie, FileSearch, PieChart, Radar } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import PieVariant from "./PieVariant";
import RedarChart from "./Redar";
import Radial from "./Radial";
import { RadialBarChart } from "recharts";

type Props = {
    data?: {
        name: string;
        value: number;
    }[];
    total?: number;
}

export const SpendigPi = ({data = [], total = 0}: Props) => {
  const [charType, setCharType] = React.useState("radial")
  const onTypeChange = (value: string) => {
    setCharType(value)
  }
  return (
    <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
            <CardTitle className="text-xl line-clamp-1">
              Spending
            </CardTitle>
            <Select
             defaultValue={charType}
             onValueChange={onTypeChange}
            >
              <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="radial" >
                  <div className="flex items-center">
                    <FileChartPie className="mr-2 size-4 shrink-0" />
                    <p className="line-clamp-1">RadialChart</p>
                  </div>
                </SelectItem>
                <SelectItem value="pie" >
                  <div className="flex items-center">
                    <PieChart className="mr-2 size-4 shrink-0" />
                    <p className="line-clamp-1">PieChart</p>
                  </div>
                </SelectItem>
                <SelectItem value="radar" >
                  <div className="flex items-center">
                    <Radar className="mr-2 size-4 shrink-0" />
                    <p className="line-clamp-1">RadarChart</p>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
        </CardHeader> 
        <CardContent >
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-y-4 text-center h-[350px] w-full">
              <FileSearch className="size-6 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No data available for this period</p>
            </div>
          ) : (
            <div>
                {charType === "pie" && <PieVariant data={data} total={total} />}
                {charType === "radar" && <RedarChart data={data} total={total} />}
                {charType === "radial" && <Radial data={data} total={total} />}
            </div>
          )}
        </CardContent>
    </Card>
  )
}