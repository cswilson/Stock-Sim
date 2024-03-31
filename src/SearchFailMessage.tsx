interface SearchFailProps {
  ticker: string
}

export const SearchFailMessage: React.FC<SearchFailProps> = ({ticker}) => {

    return (
        <p className="md:text-4xl text-lg text-red-800">Failed to find data for ticker: {ticker}</p>
    )

}