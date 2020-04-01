import React from 'react';
import { BookPath } from 'booka-common';
import {
    usePreview,
} from '../application';
import { Themed } from '../core';
import { PreviewText, ActivityIndicator } from '../controls';
import { BookPathLink } from './Navigation';

export function ParagraphPreview({ bookId, path, theme }: Themed & {
    bookId: string,
    path: BookPath,
}) {
    const { previewState } = usePreview(bookId, path);
    if (previewState.loading) {
        return <ActivityIndicator theme={theme} />;
    } else {
        return <BookPathLink
            bookId={bookId}
            path={path}
        >
            <PreviewText
                theme={theme}
                lines={10}
                text={previewState.preview?.trimStart() || 'preview is not available'}
            />
        </BookPathLink>;
    }
}
