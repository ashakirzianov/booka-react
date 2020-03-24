import React, { ReactNode } from 'react';
import {
    ContextMenuTrigger, ContextMenu as ReactContextMenu, MenuItem,
} from 'react-contextmenu';

import { Themed } from '../core';
import { HasChildren } from './common';
import { OverlayPanel } from './Panel';

export function ContextMenu({
    id, menu, children, theme,
}: HasChildren & Themed & {
    id: string,
    menu: ReactNode,
}) {
    return <>
        <ContextMenuTrigger id={id}>
            {children}
        </ContextMenuTrigger>
        <ReactContextMenu id={id}>
            <OverlayPanel theme={theme}>
                {menu}
            </OverlayPanel>
        </ReactContextMenu>
    </>;
}

export function ContextMenuItem({ children }: HasChildren) {
    return <MenuItem>
        {children}
    </MenuItem>;
}
