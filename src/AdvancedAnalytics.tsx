import React, { useEffect, useRef, useState } from "react";

import { LumpSum } from "./LumpSum";
import { DCA } from "./DCA";
import { BestWorstIntervals } from "./BestWorstIntervals";

export const AdvancedAnalytics: React.FC = () => {

    const enum Mode {
        LumpSum,
        DCA,
        BestWorst,
        None
    }

    const [currentMode, setCurrentMode] = useState(Mode.None);

    return (
        <div>
            <div className="flex flex-col justify-center items-center gap-4 xl:flex-row">
                <div>
                    <button className="btn w-48 md:w-64" onClick={() => setCurrentMode(Mode.LumpSum)}>Lump Sum</button>
                </div>
                <div>
                    <button className="btn w-48 md:w-64" onClick={() => setCurrentMode(Mode.DCA)}>Dollar Cost Average</button>
                </div>
                <div>
                    <button className="btn w-48 md:w-64" onClick={() => setCurrentMode(Mode.BestWorst)}>Best/Worst Intervals</button>
                </div>
            </div>
            {currentMode == Mode.LumpSum && <LumpSum/>}
            {currentMode == Mode.DCA && <DCA/>}
            {currentMode == Mode.BestWorst && <BestWorstIntervals/>}
        </div>
    );
};