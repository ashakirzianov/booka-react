import React, { useCallback, useMemo } from 'react';

import {
    BookFragment, BookPath, BookRange,
} from 'booka-common';
import {
    Color, Path, RichText, RichTextSelection,
} from './RichText';
import {
    ColorizedRange, bookPathForBlockPath, buildBlocksData, blockPathForBookPath,
} from './BookFragmentComp.blocks';
import { RefCompType } from './RichText/RichText';

export type BookSelection = {
    text: string,
    range: BookRange,
};

export function BookFragmentComp({
    fragment,
    onScroll, onSelectionChange, RefComp,
    pathToScroll, colorization,
    fontSize, fontFamily, color, refColor, refHoverColor,
}: {
    fragment: BookFragment,
    color: Color,
    refColor: Color,
    refHoverColor: Color,
    fontSize: number,
    fontFamily: string,
    colorization?: ColorizedRange[],
    pathToScroll?: BookPath,
    onScroll?: (path: BookPath) => void,
    onSelectionChange?: (selection: BookSelection | undefined) => void,
    RefComp: RefCompType,
}) {
    const blocksData = useMemo(
        () => {
            return buildBlocksData({
                fragment,
                colorization,
                fontSize,
                refColor,
                refHoverColor,
            });
        },
        [fragment, colorization, fontSize, refColor, refHoverColor],
    );
    const scrollHandler = useCallback((path: Path) => {
        if (!onScroll) {
            return;
        } else {
            const bookPath = bookPathForBlockPath(path, blocksData);
            if (bookPath) {
                onScroll(bookPath);
            }
        }
    }, [onScroll, blocksData]);

    const selectionHandler = useCallback((richTextSelection: RichTextSelection | undefined) => {
        if (!onSelectionChange) {
            return;
        }
        if (richTextSelection === undefined) {
            onSelectionChange(richTextSelection);
        } else {
            const start = bookPathForBlockPath(richTextSelection.range.start, blocksData);
            if (start !== undefined) {
                const end = bookPathForBlockPath(richTextSelection.range.end, blocksData);
                const bookSelection: BookSelection = {
                    text: richTextSelection.text,
                    range: { start, end },
                };
                onSelectionChange(bookSelection);
            }
        }
    }, [onSelectionChange, blocksData]);

    const blockPathToScroll = pathToScroll && blockPathForBookPath(pathToScroll, blocksData);

    return <RichText
        blocks={blocksData.map(bd => bd.block)}
        color={color}
        fontSize={fontSize}
        fontFamily={fontFamily}
        onScroll={scrollHandler}
        pathToScroll={blockPathToScroll}
        onSelectionChange={selectionHandler}
        RefComp={RefComp}
    />;
}
