import React from 'react';

import { Menu, Item, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

import { WithChildren } from '../atoms';
import { BookSelection } from '../reader';
import { Callback, Highlight } from 'booka-common';

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

export function BookContextMenu({ children, target, onAddHighlight }: WithChildren<{
    target: ContextMenuTarget,
    onAddHighlight: Callback<string>,
}>) {
    if (target.target === 'empty') {
        return <>{children}</>;
    }
    return <>
        <MenuProvider
            id='book-menu'
            style={{
                display: 'inline-block',
            }}
            event='onClick'
        >
            {children}
        </MenuProvider>
        <Menu id='book-menu'>
            <AddHighlightItem target={target} onAddHighlight={onAddHighlight} />
        </Menu>
    </>;
}

function AddHighlightItem({ target, onAddHighlight }: {
    target: ContextMenuTarget,
    onAddHighlight: Callback<string>,
}) {
    if (target.target !== 'selection') {
        return null;
    }

    return <Item
        onClick={() => onAddHighlight('main')}
    >
        Add highlight
    </Item>;
}
