import React from 'react';

import { CurrentPosition } from 'booka-common';
import {
    usePositions, useTheme, usePreview, useLibraryCard,
} from '../application';
import { CurrentBookView } from '../views';

export function CurrentBookPanel() {
    const positions = usePositions();
    if (positions.length === 0) {
        return null;
    }

    const mostRecent = positions.reduce(
        (most, curr) => most.created < curr.created
            ? curr : most,
    );
    return <CurrentBook position={mostRecent} />;
}

function CurrentBook({ position }: {
    position: CurrentPosition,
}) {
    const theme = useTheme();
    const preview = usePreview(position.bookId, position.path);
    const card = useLibraryCard(position.bookId);
    return <CurrentBookView
        theme={theme}
        position={position}
        card={card}
        preview={preview}
        page='25 of 314'
    />;
}
