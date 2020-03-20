import React from 'react';
import { CurrentPosition } from 'booka-common';
import {
    usePositions, useTheme, Themed,
} from '../application';
import {
    Column, TitledPanel,
} from '../controls';
import { ParagraphPreview } from './ParagraphPreview';
import { BookIdTile } from './LibraryCardTile';

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
        <CurrentBookContent
            theme={theme}
            position={mostRecent}
        />
    </TitledPanel>;
}

function CurrentBookContent({ position, theme }: Themed & {
    position: CurrentPosition,
}) {
    return <Column>
        <BookIdTile bookId={position.bookId} />
        <ParagraphPreview
            bookId={position.bookId}
            path={position.path}
        />
    </Column>;
}
