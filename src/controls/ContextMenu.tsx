import React, { ReactNode } from 'react';
import {
    ContextMenuTrigger, ContextMenu as ReactContextMenu, MenuItem,
} from 'react-contextmenu';

import { Themed } from '../core';
import { HasChildren } from './common';
import { OverlayPanel } from './Panel';

export function ContextMenu({
    id, trigger, children, theme,
}: HasChildren & Themed & {
    id: string,
    trigger: ReactNode,
}) {
    return <>
        <ContextMenuTrigger id={id}>
            {trigger}
        </ContextMenuTrigger>
        <ReactContextMenu id={id}>
            <OverlayPanel theme={theme}>
                {children}
            </OverlayPanel>
        </ReactContextMenu>
    </>;
}

export function ContextMenuItem({ onClick, children }: HasChildren & {
    onClick?: () => void,
}) {
    return <MenuItem onClick={onClick}>
        {children}
    </MenuItem>;
}
