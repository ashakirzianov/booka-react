import { useState, useEffect } from 'react';
import { CurrentPosition } from 'booka-common';
import { useDataProvider } from './dataProviderHooks';

export type PositionsState = CurrentPosition[];
export function usePositions() {
    const { addCurrentPosition, currentPositions } = useDataProvider();
    const [positions, setPositions] = useState<PositionsState>([]);
    useEffect(() => {
        const sub = currentPositions().subscribe(setPositions);
        return () => sub.unsubscribe();
    }, [currentPositions]);
    return { positions, addCurrentPosition };
}
