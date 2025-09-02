import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useDebounce } from '../../utils/hooks/useDebounce';

export type ChartDataType = {
  name: string;
  value: number;
};

export default function DevicesChart({
  data,
  onHover,
}: {
  data: ChartDataType[];
  onHover: (name: ChartDataType['name'], value: ChartDataType['value']) => void;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <ResponsiveContainer
      className={'border-none p-0 outline-none select-none [&_*]:outline-none'}
      width="100%"
      height="100%"
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          innerRadius={75}
          outerRadius={100}
          startAngle={90}
          endAngle={-270}
          paddingAngle={4}
          cornerRadius={10}
          onMouseEnter={({ payload }, index) => {
            onHover(payload.name, payload.value);
            setActiveIndex(index);
          }}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={activeIndex === index ? '#00B512' : '#F6F6F6'}
              style={{
                transformOrigin: 'center center',
                transform: activeIndex === index ? `scale(1.05)` : `scale(1)`,
              }}
              stroke="none"
            />
          ))}
        </Pie>

        <Tooltip cursor={false} content={<CustomChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CustomChartTooltip({ active, payload }: any) {
  const debouncedActive = useDebounce(active, 100);
  const debouncedPayload = useDebounce(payload, 100);

  const isActive =
    debouncedActive &&
    Array.isArray(debouncedPayload) &&
    debouncedPayload.length > 0;

  return (
    <div
      className={`text-body-m bg-bgPr rounded-8 border-linePr w-fit border p-8 ${
        isActive ? '' : 'opacity-0'
      }`}
    >
      <p className="text-textHeadline/80 text-body-xs">{payload[0]?.name}</p>
      <p className={'text-body-xs text-textHeadline font-medium'}>
        {payload[0]?.value}
      </p>
    </div>
  );
}
