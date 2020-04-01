import { useEffect, useState } from 'react';
import { Highlight, AuthToken } from 'booka-common';
import { useDataProvider } from './dataProviderHooks';
import { sameArrays } from '../utils';

export type HighlightsState = Highlight[];
export function useHighlights(bookId: string, token?: AuthToken) {
    const { highlightsForId } = useDataProvider();
    const [highlights, setHighlights] = useState<HighlightsState>([]);
    useEffect(() => {
        const sub = highlightsForId(bookId).subscribe(hs => {
            if (!sameArrays(highlights, hs)) {
                console.log('------');
                console.log(highlights);
                console.log(hs);
                setHighlights(hs);
            }
        });
        return () => sub.unsubscribe();
    }, [highlights, highlightsForId, bookId]);
    return highlights;
}

export function useHighlightsActions() {
    const { addHighlight, removeHighlight, updateHighlightGroup } = useDataProvider();
    return { addHighlight, removeHighlight, updateHighlightGroup };
}
