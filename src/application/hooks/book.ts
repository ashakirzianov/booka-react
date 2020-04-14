import { useState, useEffect, useCallback } from 'react';
import { map } from 'rxjs/operators';
import {
    BookPath, TableOfContents,
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
        type: 'book/controls-toggle',
    }), [dispatch]);
}

export function useToc(): Loadable<TableOfContents> {
    return useAppSelector(
        s => s.book?.fragment && !s.book.fragment.loading
            ? s.book.fragment.toc : undefined,
    ) ?? { loading: true };
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

    return previewState;
}

export function useUploadEpub() {
    const dp = useDataProvider();
    return useCallback((data: any, publicDomain: boolean) =>
        dp.uploadEpub(data, publicDomain),
        [dp],
    );
}
