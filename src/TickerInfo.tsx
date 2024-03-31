import { AdvancedAnalytics } from "./AdvancedAnalytics"
import { LineChartComp } from "./LineChartComp"

interface TickerInfoProps {
  tickerName: string
  prices: number[]
  times: number[]
}

export const TickerInfo: React.FC<TickerInfoProps> = ({ tickerName, prices, times }) => {

    return (
        <div className="App-common">
          <p className="text-2xl">{tickerName} Price History (USD)</p>
          <LineChartComp prices={prices} times={times} />
          <AdvancedAnalytics></AdvancedAnalytics>
        </div>
    )

}