import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

import { useDebounce } from '../../utils/hooks/useDebounce';

export type ChartDataType = {
  name: string;
  revenue: number;
};

export default function RevenueChart({ data }: { data: ChartDataType[] }) {
  return (
    <ResponsiveContainer
      className={'border-none p-0 outline-none select-none [&_*]:outline-none'}
      width="100%"
      height="100%"
    >
      <AreaChart data={data}>
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00A656" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#00A656" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray={'5 7'}
          vertical={false}
          stroke={'#EAEAEA'}
          strokeLinecap={'round'}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: '#8B8B8B',
            fontSize: '0.8125rem',
            dy: 10,
          }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fill: '#8B8B8B',
            fontSize: '0.8125rem',
            textAnchor: 'start',
            dx: -50,
          }}
        />
        <Tooltip cursor={false} content={<CustomChartTooltip />} />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke="rgba(0, 181, 18, 0.8)"
          strokeWidth={'0.1875rem'}
          fillOpacity={1}
          fill="url(#color)"
        />
      </AreaChart>
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
      <p className="text-textHeadline/80 text-body-s">Earning</p>
      <p className={'text-body-m text-textHeadline font-medium'}>
        ${payload[0]?.value}
      </p>
    </div>
  );
}
