import React, { ReactNode } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
    ContextMenuTrigger, ContextMenu as ReactContextMenu, MenuItem,
} from 'react-contextmenu';

import { Themed, colors } from '../core';
import { HasChildren } from './common';
import { OverlayPanel } from './Panel';

export function ContextMenu({
    id, trigger, children, theme,
}: HasChildren & Themed & {
    id: string,
    trigger: ReactNode,
}) {
    return <React.Fragment>
        <ContextMenuTrigger id={id}>
            {trigger}
        </ContextMenuTrigger>
        <ReactContextMenu id={id}>
            <OverlayPanel theme={theme}>
                {children}
            </OverlayPanel>
        </ReactContextMenu>
    </React.Fragment>;
}

export function ContextMenuItem({ onClick, theme, children }: HasChildren & Themed & {
    onClick?: () => void,
}) {
    return <MenuItem onClick={onClick}>
        <div css={{
            width: '100%',
            '&:hover': {
                backgroundColor: colors(theme).highlight,
            },
        }}>
            {children}
        </div>
    </MenuItem>;
}
