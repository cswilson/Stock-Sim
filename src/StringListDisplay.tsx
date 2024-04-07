interface StringListDisplayProps {
  strings: string[];
}

export const StringListDisplay: React.FC<StringListDisplayProps> = ({strings}) => {
    return (
        <div>
        {strings.map((str, index) => (
            <p key={index}>{str}</p>
        ))}
        </div>
    );
}