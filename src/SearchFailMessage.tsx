interface SearchFailProps {
  ticker: string
}

export const SearchFailMessage: React.FC<SearchFailProps> = ({ticker}) => {

    return (
        <p className="text-red-800">Failed to find data for ticker: {ticker}</p>
    )

}