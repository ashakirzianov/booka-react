import React from 'react';

import { Menu, Item, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

import { WithChildren } from '../atoms';
import { BookSelection } from '../reader';
import { Highlight, BookRange, HighlightGroup } from 'booka-common';
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
        <MenuProvider
            id='book-menu'
            style={{
                display: 'inline-block',
            }}
        >
            {children}
        </MenuProvider>
        <Menu id='book-menu'>
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
        </Menu>
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

    return <Item
        onClick={() => addHighlight(bookId, target.selection.range, 'green')}
    >
        Add highlight
    </Item>;
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

    return <Item
        onClick={() => removeHighlight(target.highlight._id)}
    >
        Remove highlight
    </Item>;
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

    return <Item
        onClick={() => setHighlightGroup(target.highlight._id, group)}
    >
        Make highlight {group}
    </Item>;
}
