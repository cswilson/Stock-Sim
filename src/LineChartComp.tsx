import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TimeSeriesData } from "./TimeSeriesData"

interface LineChartProps {
  prices: TimeSeriesData
}

export const LineChartComp: React.FC<LineChartProps> = ({prices}) => {

  const generateData = (): any[] => {
    const humanReadableTimes = prices.times.map((time: number) => {
      const date = new Date(time);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      return `${month}-${year}`;
    })

    const data: any[] = [];
    for (var i = 0; i < prices.values.length; i++) {
      data.push({ name: humanReadableTimes[i], price: prices.values[i] })
    }

    return data;
  }

  return (
    <div className="my-5" style={{ width: '90vw', height: '50vh' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={generateData()}>
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