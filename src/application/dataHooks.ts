import { useState, useEffect, useMemo } from 'react';
import {
    AuthToken, Bookmark, Highlight, ResolvedCurrentPosition,
    BookFragment, LibraryCard, SearchResult,
} from 'booka-common';
import { dataProvider } from '../data';
import { BookLink } from '../core';
import { map } from 'rxjs/operators';

type Loadable<T> =
    | { state: 'loading' }
    | { state: 'ready' } & T
    ;

const dp = dataProvider();
function useDataProvider() {
    // TODO: get from context
    return dp;
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

type BookState = Loadable<{
    fragment: BookFragment,
}>;
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

export type LibraryCardState = Loadable<{
    card: LibraryCard,
}>;
export function useLibraryCardData(bookId: string) {
    const data = useDataProvider();
    const [state, setState] = useState<LibraryCardState>({ state: 'loading' });
    const { observable } = useMemo(
        () => data.libraryCard({ bookId }),
        [data, bookId],
    );
    useEffect(() => {
        const sub = observable.pipe(
            map((card): LibraryCardState => ({
                state: 'ready', card,
            }))
        ).subscribe(setState);
        return () => sub.unsubscribe();
    }, [observable]);

    return state;
}

export type SearchState = Loadable<{
    results: SearchResult[],
}>;
export function useSearchData(query: string) {
    const data = useDataProvider();
    const [state, setState] = useState<SearchState>({ state: 'loading' });
    const { observable } = useMemo(
        () => data.search({ query }),
        [data, query],
    );
    useEffect(() => {
        const sub = observable.pipe(
            map((results): SearchState => ({
                state: 'ready', results,
            }))
        ).subscribe(setState);
        return () => sub.unsubscribe();
    }, [observable]);

    return state;
}
