import { useEffect, useState } from 'react';
import { Highlight, AuthToken } from 'booka-common';
import { useDataProvider } from './dataProviderHooks';
import { sameArrays } from '../utils';

export type HighlightsState = Highlight[];
export function useHighlights(bookId: string, token?: AuthToken) {
    const { highlightsForId, addHighlight, removeHighlight, updateHighlightGroup } = useDataProvider();
    const [highlights, setHighlights] = useState<HighlightsState>([]);
    useEffect(() => {
        const sub = highlightsForId(bookId).subscribe(hs => {
            if (!sameArrays(highlights, hs)) {
                setHighlights(hs);
            }
        });
        return () => sub.unsubscribe();
    }, [highlights, highlightsForId, bookId]);
    return {
        highlights,
        addHighlight,
        removeHighlight,
        updateHighlightGroup,
    };
}
