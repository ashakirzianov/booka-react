import React from 'react';

import { CurrentPosition, pageForPosition } from 'booka-common';
import {
    usePositions, useTheme, usePathData, useLibraryCard,
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
    const pathData = usePathData(position.bookId, position.path);
    const card = useLibraryCard(position.bookId);
    const page = pathData.loading
        ? pathData
        : `${pageForPosition(pathData.position)} of ${pageForPosition(pathData.of)}`;
    const preview = pathData.loading
        ? pathData : pathData.preview;
    return <CurrentBookView
        theme={theme}
        position={position}
        card={card}
        preview={preview}
        page={page}
    />;
}
