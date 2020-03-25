import React from 'react';

import { Highlight, BookRange, HighlightGroup } from 'booka-common';
import { BookSelection } from '../reader';
import { useHighlights, useTheme } from '../application';
import { ContextMenu, ContextMenuItem, HasChildren } from '../controls';
import { Themed } from '../core';

type HighlightTarget = {
    target: 'highlight',
    highlight: Highlight,
};
type SelectionTarget = {
    target: 'selection',
    selection: BookSelection,
};
type EmptyTarget = {
    target: 'empty',
};
export type ContextMenuTarget =
    | HighlightTarget
    | SelectionTarget
    | EmptyTarget
    ;

export function BookContextMenu({
    children, target, bookId,
}: HasChildren & {
    bookId: string
    target: ContextMenuTarget,
}) {
    const { theme } = useTheme();
    const {
        addHighlight, removeHighlight, updateHighlightGroup,
    } = useHighlights(bookId);

    if (target.target === 'empty') {
        return <>{children}</>;
    }
    return <ContextMenu
        theme={theme}
        id='book-menu'
        trigger={children}
    >
        <AddHighlightItem
            theme={theme}
            target={target}
            bookId={bookId}
            addHighlight={addHighlight}
        />
        <RemoveHighlightItem
            theme={theme}
            target={target}
            removeHighlight={removeHighlight}
        />
        <SetHighlightGroupItem
            theme={theme}
            target={target}
            group='green'
            setHighlightGroup={updateHighlightGroup}
        />
        <SetHighlightGroupItem
            theme={theme}
            target={target}
            group='red'
            setHighlightGroup={updateHighlightGroup}
        />
        <SetHighlightGroupItem
            theme={theme}
            target={target}
            group='yellow'
            setHighlightGroup={updateHighlightGroup}
        />
    </ContextMenu>;
}

function AddHighlightItem({
    target, bookId, addHighlight, theme,
}: Themed & {
    target: ContextMenuTarget,
    bookId: string,
    addHighlight: (bookId: string, range: BookRange, group: HighlightGroup) => void,
}) {
    if (target.target !== 'selection') {
        return null;
    }

    return <ContextMenuItem
        theme={theme}
        onClick={() => addHighlight(bookId, target.selection.range, 'green')}
    >
        Add highlight
    </ContextMenuItem>;
}

function RemoveHighlightItem({
    target, removeHighlight, theme,
}: Themed & {
    target: ContextMenuTarget,
    removeHighlight: (highlightId: string) => void,
}) {
    if (target.target !== 'highlight') {
        return null;
    }

    return <ContextMenuItem
        theme={theme}
        onClick={() => removeHighlight(target.highlight.uuid)}
    >
        Remove highlight
    </ContextMenuItem>;
}

function SetHighlightGroupItem({
    target, group, setHighlightGroup, theme,
}: Themed & {
    target: ContextMenuTarget,
    group: string,
    setHighlightGroup: (id: string, group: string) => void,
}) {
    if (target.target !== 'highlight' || target.highlight.group === group) {
        return null;
    }

    return <ContextMenuItem
        theme={theme}
        onClick={() => setHighlightGroup(target.highlight.uuid, group)}
    >
        Make highlight {group}
    </ContextMenuItem>;
}
