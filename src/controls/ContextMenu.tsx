import React, { ReactNode } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
    ContextMenuTrigger, ContextMenu as ReactContextMenu, MenuItem,
} from 'react-contextmenu';

import { Themed, colors, getFontSize } from '../core';
import { HasChildren, menuWidth, normalPadding, normalMargin } from './common';
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
            <OverlayPanel
                theme={theme}
                width={menuWidth}
            >
                {children}
            </OverlayPanel>
        </ReactContextMenu>
    </React.Fragment>;
}

export function ContextMenuItem({ callback, theme, children }: HasChildren & Themed & {
    callback?: () => void,
}) {
    return <MenuItem onClick={callback}>
        <div css={{
            display: 'flex',
            flexBasis: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: normalPadding,
        }}>
            {children}
        </div>
    </MenuItem>;
}

export function TextContextMenuItem({
    theme, callback, icon, text,
}: Themed & {
    text: string,
    icon?: IconName,
    callback?: () => void,
}) {
    return <MenuItem onClick={callback}>
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
            padding: normalPadding,
        }}>
            {
                !icon ? null :
                    <Icon
                        theme={theme}
                        name={icon}
                        margin={normalMargin}
                    />
            }
            <span css={{
                margin: normalMargin,
                fontSize: getFontSize(theme, 'xsmall'),
                fontFamily: theme.fontFamilies.menu,
            }}>
                {text}
            </span>
        </div>
    </MenuItem>;
}
