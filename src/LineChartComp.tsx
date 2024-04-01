import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface LineChartProps {
  prices: number[]
  times: number[]
}

export const LineChartComp: React.FC<LineChartProps> = ({ prices, times }) => {

  const generateData = (): any[] => {

    const humanReadableTimes = times.map((time: number) => {
      const date = new Date(time * 1000);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      return `${month}-${year}`;
    })

    const data: any[] = [];
    for (var i = 0; i < prices.length; i++) {
      data.push({ name: humanReadableTimes[i], price: prices[i] })
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