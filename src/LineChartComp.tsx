import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TimeSeriesData } from "./TimeSeriesData"
import {Utils} from "./Utils";

interface LineChartProps {
  prices: TimeSeriesData
}

export const LineChartComp: React.FC<LineChartProps> = ({ prices }) => {

  const buildChartData = (): any[] => {
    const humanReadableTimes = prices.times().map((time: number) => Utils.formatDate(new Date(time)));

    const data: any[] = humanReadableTimes.map((time, index) => ({
      name: time,
      price: prices.valueAt(index)
    }));

    return data;
  }

  return (
    <div className="my-5" style={{ width: '90vw', height: '50vh' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={buildChartData()}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis tick={{ fontSize: 16 }} dataKey="name"
          />
          <YAxis tick={{ fontSize: 16 }}
          />
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <Tooltip />
          <Area type="monotone" dataKey="price" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUv)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )

}