import { useState, useEffect } from 'react';
import { map } from 'rxjs/operators';
import {
    BookPath, LibraryCard, TableOfContents,
} from 'booka-common';
import { Loadable } from './utils';
import { useAppDispatch, useAppSelector, useDispatchCallback } from './redux';
import { useDataProvider } from './dataProvider';

export function useOpenBook({ bookId, path, refId }: {
    bookId: string,
    path?: BookPath,
    refId?: string,
}) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch({
            type: 'book-req',
            payload: {
                bookId, refId, path,
            },
        });
    }, [bookId, path, refId, dispatch]);

    return useAppSelector(s => s.book);
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
    const uploadEpub = useDispatchCallback('upload-req-upload');
    const selectFile = useDispatchCallback('upload-select-file');

    return { uploadState, uploadEpub, selectFile };
}
