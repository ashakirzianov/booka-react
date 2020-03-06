import { useState, useEffect, useMemo } from 'react';
import {
    AuthToken, Bookmark, Highlight,
} from 'booka-common';
import { dataProvider } from '../data';

function useDataProvider() {
    // TODO: get from context
    return dataProvider();
}

type BookmarksState = Bookmark[];
export function useBookmarksData(bookId: string, token?: AuthToken) {
    const data = useDataProvider();
    const [bookmarks, setBookmarks] = useState<BookmarksState>([]);
    const { subject, add, remove } = useMemo(
        () => data.bookmarksForId(bookId, token),
        [bookId, token],
    );
    useEffect(() => {
        const sub = subject.subscribe(setBookmarks);
        return () => sub.unsubscribe();
    }, [subject]);
    return { bookmarks, add, remove };
}

type HighlightsState = Highlight[];
export function useHighlightsData(bookId: string, token?: AuthToken) {
    const data = useDataProvider();
    const [highlights, setHighlights] = useState<HighlightsState>([]);
    const { subject, add, remove } = useMemo(
        () => data.highlightsForId(bookId, token),
        [bookId, token],
    );
    useEffect(() => {
        const sub = subject.subscribe(setHighlights);
        return () => sub.unsubscribe();
    }, [subject]);
    return { highlights, add, remove };
}
