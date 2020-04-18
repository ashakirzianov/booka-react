import React from 'react';

import { uniqBy } from 'lodash';
import { CurrentPosition, pageForPosition } from 'booka-common';
import {
    usePositions, useTheme, usePathData, useLibraryCard,
} from '../application';
import { doubleSpace, megaSpace } from '../controls';
import { BookPreview } from './BookPreview';

export function ReadingHistory() {
    const positions = usePositions();
    if (positions.length === 0) {
        return null;
    }

    const recent = buildRecent(positions);
    return <ReadingHistoryList
        positions={recent}
    />;
}

function buildRecent(positions: CurrentPosition[]): CurrentPosition[] {
    const sorted = positions.sort(
        (a, b) => b.created.valueOf() - a.created.valueOf(),
    );
    const uniq = uniqBy(sorted, s => s.bookId);
    return uniq;
}

function ReadingHistoryList({ positions }: {
    positions: CurrentPosition[],
}) {
    return <div style={{
        display: 'flex',
        flexGrow: 1,
        flexShrink: 1,
        overflow: 'scroll',
        justifyContent: 'flex-start',
        padding: megaSpace,
    }}>
        {
            positions.map((position, idx) => <div key={idx} style={{
                marginRight: doubleSpace,
            }}>
                <ReadingHistoryTile
                    position={position}
                />
            </div>)
        }
    </div>;
}

function ReadingHistoryTile({ position }: {
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
    return <BookPreview
        theme={theme}
        bookId={position.bookId}
        path={position.path}
        card={card}
        preview={preview}
        page={page}
    />;
}
