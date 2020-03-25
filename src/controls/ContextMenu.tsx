import React, { ReactNode } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
    ContextMenuTrigger, ContextMenu as ReactContextMenu, MenuItem,
} from 'react-contextmenu';

import { Themed, colors, getFontSize } from '../core';
import { HasChildren, halfMargin } from './common';
import { OverlayPanel } from './Panel';
import { IconName, Icon } from './Icon';

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
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        }}>
            {children}
        </div>
    </MenuItem>;
}

export function TextContextMenuItem({
    theme, onClick, icon, text,
}: Themed & {
    text: string,
    icon?: IconName,
    onClick?: () => void,
}) {
    return <MenuItem onClick={onClick}>
        <div css={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            color: colors(theme).text,
            '&:hover': {
                backgroundColor: colors(theme).highlight,
                color: colors(theme).primary,
            },
        }}>
            {
                !icon ? null :
                    <Icon
                        theme={theme}
                        name={icon}
                        margin={halfMargin}
                    />
            }
            <span css={{
                margin: halfMargin,
                fontSize: getFontSize(theme, 'nano'),
                fontFamily: theme.fontFamilies.menu,
            }}>
                {text}
            </span>
        </div>
    </MenuItem>;
}
