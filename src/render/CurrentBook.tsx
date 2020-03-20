import React from 'react';
import { CurrentPosition, BookPath } from 'booka-common';
import {
    usePositions, useLibraryCard, usePreview, useTheme, Themed,
} from '../application';
import {
    Column, BookPathLink, TitledPanel, BookTile,
} from '../controls';

export function CurrentBook() {
    const { theme } = useTheme();
    const { positions } = usePositions();
    if (positions.length === 0) {
        return null;
    }

    const mostRecent = positions.reduce(
        (most, curr) => most.created < curr.created
            ? curr : most,
    );

    return <TitledPanel theme={theme} title='Current'>
        <CurrentPosition
            theme={theme}
            position={mostRecent}
        />
    </TitledPanel>;
}

function CurrentPosition({ position, theme }: Themed & {
    position: CurrentPosition,
}) {
    const { cardState } = useLibraryCard(position.bookId);

    return <Column>
        {
            cardState.state === 'ready'
                ? <BookTile
                    theme={theme}
                    card={cardState.card}
                />
                : null
        }
        <Preview
            bookId={position.bookId}
            path={position.path}
        />
    </Column>;
}

// TODO: extract
function Preview({ bookId, path }: {
    bookId: string,
    path: BookPath,
}) {
    const { previewState } = usePreview(bookId, path);
    return <BookPathLink
        bookId={bookId}
        path={path}
    >
        {
            previewState.state === 'ready'
                ? <span>{previewState.preview ?? 'preview is not available'}</span>
                : <span>...loading</span>
        }
    </BookPathLink>;
}
