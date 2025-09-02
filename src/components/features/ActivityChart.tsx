import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useDebounce } from "../../utils/hooks/useDebounce";

export type ChartDataType = {
  name: string;
  Mathematics: number;
  Physics: number;
  Chemistry: number;
};

export default function ActivityChart({ data }: { data: ChartDataType[] }) {
  const [activeIndex, setActiveIndex] = useState<number | string | null>(null);

  const barColor = (index: number) =>
    activeIndex == index ? "rgba(0, 181, 18, 0.8)" : "#EAEAEA";

  const getBarSizePercent = (): string => {
    if (data.length <= 5) return "2.5%";
    const percent = Math.max(1, 4 * (5 / data.length));
    return `${percent}%`;
  };

  return (
    <ResponsiveContainer
      className={"border-none p-0 outline-none select-none [&_*]:outline-none"}
      width="100%"
      height="100%"
    >
      <BarChart
        data={data}
        barGap={"2.45%"}
        onMouseMove={(state) => {
          if (state && state.activeTooltipIndex != null) {
            setActiveIndex(state.activeTooltipIndex);
          } else {
            setActiveIndex(null);
          }
        }}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <CartesianGrid
          strokeDasharray={"5 7"}
          vertical={false}
          stroke={"#EAEAEA"}
          strokeLinecap={"round"}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#333", fontSize: "0.8125rem" }}
        />
        <YAxis hide />
        <Tooltip cursor={false} content={<CustomChartTooltip />} />

        <Bar dataKey="Mathematics" barSize={getBarSizePercent()}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={barColor(index)} />
          ))}
        </Bar>

        <Bar dataKey="Physics" barSize={getBarSizePercent()}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={barColor(index)} />
          ))}
        </Bar>

        <Bar dataKey="Chemistry" barSize={getBarSizePercent()}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={barColor(index)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CustomChartTooltip({ active, payload }: any) {
  const debouncedActive = useDebounce(active, 100);
  const debouncedPayload = useDebounce(payload, 10);

  const isActive =
    debouncedActive &&
    Array.isArray(debouncedPayload) &&
    debouncedPayload.length > 0;

  return (
    <div
      className={`text-body-m bg-bgPr rounded-8 shadow-s1 w-fit p-8 ${
        isActive ? "" : "opacity-0"
      }`}
    >
      <p className="text-textHeadline">26 Feb, 2044</p>
      <ul className="mt-4">
        {debouncedPayload.map((entry: any, index: number) => (
          <li className="flex justify-between gap-16" key={index}>
            <span className="text-textDescription">{entry.name}:</span>
            <span className="text-textHeadline">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
