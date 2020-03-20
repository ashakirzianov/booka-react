import React from 'react';
import { CurrentPosition } from 'booka-common';
import {
    usePositions, useLibraryCard, useTheme, Themed,
} from '../application';
import {
    Column, TitledPanel, BookTile,
} from '../controls';
import { ParagraphPreview } from './ParagraphPreview';

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
    const { card } = useLibraryCard(position.bookId);

    return <Column>
        <BookTile
            theme={theme}
            card={card}
        />
        <ParagraphPreview
            bookId={position.bookId}
            path={position.path}
        />
    </Column>;
}
