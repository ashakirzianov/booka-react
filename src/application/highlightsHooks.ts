import { useEffect, useState } from 'react';
import { Highlight, AuthToken } from 'booka-common';
import { useDataProvider } from './dataProviderHooks';

export type HighlightsState = Highlight[];
export function useHighlights(bookId: string, token?: AuthToken) {
    const { highlightsForId, addHighlight, removeHighlight, updateHighlightGroup } = useDataProvider();
    const [highlights, setHighlights] = useState<HighlightsState>([]);
    useEffect(() => {
        const sub = highlightsForId(bookId).subscribe(setHighlights);
        return () => sub.unsubscribe();
    }, [highlightsForId, bookId]);
    return {
        highlights,
        addHighlight,
        removeHighlight,
        updateHighlightGroup,
    };
}
