import { useState, useEffect, useCallback } from 'react';
import { map } from 'rxjs/operators';
import {
    BookPath, LibraryCard, TableOfContents,
} from 'booka-common';
import { Loadable } from '../../core';
import {
    useAppDispatch, useAppSelector,
} from './redux';
import { useDataProvider } from './dataProvider';

export function useBook() {
    return useAppSelector(s => s.book);
}

export function useToggleControls() {
    const dispatch = useAppDispatch();
    return useCallback(() => dispatch({
        type: 'book-controls-toggle',
    }), [dispatch]);
}

// TODO: re-implement this
export function useToc(bookId: string) {
    const { tableOfContents } = useDataProvider();
    const [state, setState] = useState<Loadable<TableOfContents>>({ loading: true });
    useEffect(() => {
        const sub = tableOfContents(bookId)
            .subscribe(setState);
        return () => sub.unsubscribe();
    }, [tableOfContents, bookId]);

    return state;
}

export type TextPreviewState = Loadable<{
    preview: string | undefined,
}>;
export function usePreview(bookId: string, path: BookPath) {
    const data = useDataProvider();
    const [previewState, setPreviewState] = useState<TextPreviewState>({ loading: true });

    useEffect(() => {
        const sub = data.textPreview(bookId, path).pipe(
            map((preview): TextPreviewState => ({
                preview,
            })),
        ).subscribe(setPreviewState);
        return () => sub.unsubscribe();
    }, [data, bookId, path]);

    return { previewState };
}

export type PopularBooksState = Loadable<LibraryCard[]>;
export function usePopularBooks() {
    const data = useDataProvider();

    const [popularBooksState, setPopularBooksState] = useState<PopularBooksState>({ loading: true });

    useEffect(() => {
        const sub = data.popularBooks().pipe(
            map((cards): PopularBooksState => {
                return cards;
            }),
        ).subscribe(setPopularBooksState);
        return () => sub.unsubscribe();
    }, [data]);

    return { popularBooksState };
}

export function useUpload() {
    const uploadState = useAppSelector(s => s.upload);
    const dispatch = useAppDispatch();
    const uploadEpub = useCallback((publicDomain: boolean) => dispatch({
        type: 'upload-req-upload',
        payload: { publicDomain },
    }), [dispatch]);
    const selectFile = useCallback((fileName: string, data: any) => dispatch({
        type: 'upload-select-file',
        payload: { fileName, data },
    }), [dispatch]);

    return { uploadState, uploadEpub, selectFile };
}
