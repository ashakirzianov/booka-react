import { useState, useEffect, useMemo } from 'react';
import {
    AuthToken, Bookmark, Highlight, ResolvedCurrentPosition, BookFragment,
} from 'booka-common';
import { dataProvider } from '../data';
import { BookLink } from '../core';
import { map } from 'rxjs/operators';

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
        [bookId, token, data],
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
        [bookId, token, data],
    );
    useEffect(() => {
        const sub = subject.subscribe(setHighlights);
        return () => sub.unsubscribe();
    }, [subject]);
    return { highlights, add, remove };
}

type PositionsState = ResolvedCurrentPosition[];
export function usePositionsData(token?: AuthToken) {
    const data = useDataProvider();
    const [positions, setPositions] = useState<PositionsState>([]);
    const { subject, add } = useMemo(
        () => data.currentPositions(token),
        [token, data],
    );
    useEffect(() => {
        const sub = subject.subscribe(setPositions);
        return () => sub.unsubscribe();
    }, [subject]);
    return { positions, add };
}

type BookState = {
    state: 'loading',
} | {
    state: 'ready',
    fragment: BookFragment,
};
export function useBookData(link: BookLink) {
    const data = useDataProvider();
    const [state, setState] = useState<BookState>({ state: 'loading' });
    const subject = useMemo(
        () => data.openLink(link),
        [link, data],
    );
    useEffect(() => {
        const sub = subject
            .pipe(
                map((r): BookState => ({
                    state: 'ready',
                    fragment: r.fragment,
                })),
            )
            .subscribe(setState);
        return () => sub.unsubscribe();
    }, [subject]);

    return state;
}
