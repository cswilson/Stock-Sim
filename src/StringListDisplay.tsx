export interface StringListDisplayProps {
  strings: string[];
  perStringStyling?: string[];
}

export const StringListDisplay: React.FC<StringListDisplayProps> = ({strings, perStringStyling = []}) => {
    return (
        <div className="mt-4 mb-4">
            {strings.map((str, index) => (
                <p className={`mt-2 ${perStringStyling[index] || ''}`} key={index}>{str}</p>
            ))}
        </div>
    );
}