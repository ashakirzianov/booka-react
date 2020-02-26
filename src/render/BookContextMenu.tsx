import React from 'react';

import { Menu, Item, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

import { WithChildren } from '../atoms';
import { BookSelection } from '../reader';
import { Callback } from 'booka-common';

type ContextMenuSelectionTarget = {
    target: 'selection',
    selection: BookSelection,
};
type ContextMenuEmptyTarget = {
    target: 'empty',
};
export type ContextMenuTarget =
    | ContextMenuSelectionTarget
    | ContextMenuEmptyTarget
    ;

export function BookContextMenu({ children, target, onAddHighlight }: WithChildren<{
    target: ContextMenuTarget,
    onAddHighlight: Callback<string>,
}>) {
    return <>
        <MenuProvider id='book-menu' style={{
            display: 'inline-block',
        }}>
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
