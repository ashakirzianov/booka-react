import { useEffect, useState } from 'react';
import { Highlight, AuthToken } from 'booka-common';
import { useDataProvider } from './dataProvider';

export type HighlightsState = Highlight[];
export function useHighlights(bookId: string, token?: AuthToken) {
    const { highlightsForId } = useDataProvider();
    const [highlights, setHighlights] = useState<HighlightsState>([]);
    useEffect(() => {
        const sub = highlightsForId(bookId).subscribe(hs => {
            setHighlights(hs);
        });
        return () => sub.unsubscribe();
    }, [highlightsForId, bookId]);
    return highlights;
}

export function useHighlightsActions() {
    const { addHighlight, removeHighlight, updateHighlightGroup } = useDataProvider();
    return { addHighlight, removeHighlight, updateHighlightGroup };
}
