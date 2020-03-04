import React, { useCallback } from 'react';

import { Menu, Item, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

import { WithChildren } from '../atoms';
import { BookSelection } from '../reader';
import { Callback, Highlight, uuid } from 'booka-common';
import { useAppDispatch, useAppSelector } from '../application';

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
    children, target,
}: WithChildren<{
    target: ContextMenuTarget,
}>) {
    const dispatch = useAppDispatch();
    const bookId = useAppSelector(s => s.book.link.bookId);

    const addHighlight = useCallback((highlight: Highlight) => dispatch({
        type: 'highlights-add',
        payload: { highlight },
    }), [dispatch]);

    const removeHighlight = useCallback((highlightId: string) => dispatch({
        type: 'highlights-remove',
        payload: { highlightId },
    }), [dispatch]);
    const setHighlightGroup = useCallback((highlightId: string, group: string) => dispatch({
        type: 'highlights-set-group',
        payload: {
            highlightId, group,
        },
    }), [dispatch]);

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
                setHighlightGroup={setHighlightGroup} />
            <SetHighlightGroupItem target={target} group='red'
                setHighlightGroup={setHighlightGroup} />
            <SetHighlightGroupItem target={target} group='yellow'
                setHighlightGroup={setHighlightGroup} />
        </Menu>
    </>;
}

function AddHighlightItem({
    target, bookId, addHighlight,
}: {
    target: ContextMenuTarget,
    bookId: string,
    addHighlight: Callback<Highlight>,
}) {
    if (target.target !== 'selection') {
        return null;
    }

    return <Item
        onClick={() => addHighlight({
            entity: 'highlight',
            _id: uuid(),
            group: 'green',
            bookId, range: target.selection.range,
        })}
    >
        Add highlight
    </Item>;
}

function RemoveHighlightItem({
    target, removeHighlight,
}: {
    target: ContextMenuTarget,
    removeHighlight: Callback<string>,
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
