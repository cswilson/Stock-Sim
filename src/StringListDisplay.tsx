import { useEffect, useRef } from "react";

export interface StringListDisplayProps {
    strings: string[];
    perStringStyling?: string[];
}

export const StringListDisplay: React.FC<StringListDisplayProps> = ({ strings, perStringStyling = [] }) => {

    const stringListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        stringListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }, [strings]);

    return (
        <div className="mt-4 mb-4" ref={stringListRef}>
            {strings.map((str, index) => (
                <p className={`mt-2 ${perStringStyling[index] || ''}`} key={index}>{str}</p>
            ))}
        </div>
    );
}