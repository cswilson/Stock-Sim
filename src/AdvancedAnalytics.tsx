import React, { useEffect, useRef, useState } from "react";

import './App.css';

export const AdvancedAnalytics: React.FC = () => {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <div className="flex flex-col items-center gap-4 xl:flex-row">
            <div>
                <button className="btn w-48 md:w-64">Lump Sum</button>
            </div>
            <div>
                <button className="btn w-48 md:w-64">Dollar Cost Average</button>
            </div>
            <div>
                <button className="btn w-48 md:w-64">Best/Worst Periods</button>
            </div>
        </div>
    );
};