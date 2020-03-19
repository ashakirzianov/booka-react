import React from 'react';
import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu';

import { Highlight, BookRange, HighlightGroup } from 'booka-common';
import { WithChildren } from '../atoms';
import { BookSelection } from '../reader';
import { useHighlights } from '../application';

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
}: WithChildren & {
    bookId: string
    target: ContextMenuTarget,
}) {
    const {
        addHighlight, removeHighlight, updateHighlightGroup,
    } = useHighlights(bookId);

    if (target.target === 'empty') {
        return <>{children}</>;
    }
    return <>
        <ContextMenuTrigger id='book-menu'>
            {children}
        </ContextMenuTrigger>
        <ContextMenu id='book-menu'>
            <div style={{
                background: 'white',
            }}>
                <AddHighlightItem
                    target={target}
                    bookId={bookId}
                    addHighlight={addHighlight}
                />
                <RemoveHighlightItem
                    target={target}
                    removeHighlight={removeHighlight}
                />
                <SetHighlightGroupItem target={target} group='green'
                    setHighlightGroup={updateHighlightGroup} />
                <SetHighlightGroupItem target={target} group='red'
                    setHighlightGroup={updateHighlightGroup} />
                <SetHighlightGroupItem target={target} group='yellow'
                    setHighlightGroup={updateHighlightGroup} />
            </div>
        </ContextMenu>
    </>;
}

function AddHighlightItem({
    target, bookId, addHighlight,
}: {
    target: ContextMenuTarget,
    bookId: string,
    addHighlight: (bookId: string, range: BookRange, group: HighlightGroup) => void,
}) {
    if (target.target !== 'selection') {
        return null;
    }

    return <MenuItem
        onClick={() => addHighlight(bookId, target.selection.range, 'green')}
    >
        Add highlight
    </MenuItem>;
}

function RemoveHighlightItem({
    target, removeHighlight,
}: {
    target: ContextMenuTarget,
    removeHighlight: (highlightId: string) => void,
}) {
    if (target.target !== 'highlight') {
        return null;
    }

    return <MenuItem
        onClick={() => removeHighlight(target.highlight.uuid)}
    >
        Remove highlight
    </MenuItem>;
}

function SetHighlightGroupItem({
    target, group, setHighlightGroup,
}: {
    target: ContextMenuTarget,
    group: string,
    setHighlightGroup: (id: string, group: string) => void,
}) {
    if (target.target !== 'highlight' || target.highlight.group === group) {
        return null;
    }

    return <MenuItem
        onClick={() => setHighlightGroup(target.highlight.uuid, group)}
    >
        Make highlight {group}
    </MenuItem>;
}
