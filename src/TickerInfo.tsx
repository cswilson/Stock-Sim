import { useContext } from "react"
import { AdvancedAnalytics } from "./AdvancedAnalytics"
import { LineChartComp } from "./LineChartComp"
import { TickerContext } from "./App"

export const TickerInfo: React.FC = () => {

    const tickerdata = useContext(TickerContext);

    return (
        <div className="App-common">
          <p className="text-2xl">{tickerdata.symbol} Price History (USD)</p>
          <LineChartComp prices={tickerdata.prices}/>
          <AdvancedAnalytics></AdvancedAnalytics>
        </div>
    )

}