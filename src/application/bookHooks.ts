import { useState, useEffect } from 'react';
import { map } from 'rxjs/operators';
import { BookFragment, BookPath, firstPath } from 'booka-common';
import { Loadable } from './utils';
import { useDataProvider } from './dataProviderHooks';

export type BookState = Loadable<{
    fragment: BookFragment,
}>;
export function useBook({ bookId, path, refId }: {
    bookId: string,
    path?: BookPath,
    refId?: string,
}) {
    const data = useDataProvider();
    const [bookState, setBookState] = useState<BookState>({ loading: true });
    useEffect(() => {
        const observable = refId
            ? data.fragmentForRef(bookId, refId)
            : data.fragmentForPath(bookId, path || firstPath());
        const sub = observable
            .pipe(
                map((fragment): BookState => ({
                    fragment,
                })),
            )
            .subscribe(setBookState);
        return () => sub.unsubscribe();
    }, [data, bookId, path, refId]);

    return { bookState };
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
