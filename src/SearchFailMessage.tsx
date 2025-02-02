interface SearchFailProps {
  tickerSymbol: string
}

export const SearchFailMessage: React.FC<SearchFailProps> = ({tickerSymbol}) => {

    return (
        <p className="md:text-4xl text-lg fail">Failed to find data for ticker symbol: {tickerSymbol}</p>
    )

}