import React from 'react';
import { BookPath } from 'booka-common';
import {
    usePreview,
} from '../application';
import { BookPathLink } from './Navigation';

export function ParagraphPreview({ bookId, path }: {
    bookId: string,
    path: BookPath,
}) {
    const { previewState } = usePreview(bookId, path);
    return <BookPathLink
        bookId={bookId}
        path={path}
    >
        {
            previewState.loading
                ? <span>...loading</span>
                : <span>{previewState.preview ?? 'preview is not available'}</span>
        }
    </BookPathLink>;
}
