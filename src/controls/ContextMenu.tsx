// eslint-disable-next-line
import React from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Themed, colors } from '../core';
import {
    HasChildren, menuWidth, regularSpace, fontCss,
} from './common';
import { OverlayPanel } from './Panel';
import { IconName, Icon } from './Icon';

export function ContextMenu({
    children, theme, position,
}: HasChildren & Themed & {
    position: { top: number, left: number },
}) {
    return <div style={{
        position: 'fixed',
        top: position.top, left: position.left,
        display: 'flex',
        flexDirection: 'column',
    }}>
        <OverlayPanel
            theme={theme}
            width={menuWidth}
        >
            {children}
        </OverlayPanel>
    </div>;
}

export function ContextMenuItem({ callback, theme, children }: HasChildren & Themed & {
    callback?: () => void,
}) {
    return <div css={{
        display: 'flex',
        flexBasis: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: regularSpace,
    }}
        onClick={callback}
    >
        {children}
    </div>;
}

export function TextContextMenuItem({
    theme, callback, icon, text,
}: Themed & {
    text: string,
    icon?: IconName,
    callback?: () => void,
}) {
    return <div css={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        color: colors(theme).text,
        '&:hover': {
            backgroundColor: colors(theme).highlight,
            color: colors(theme).primary,
        },
        padding: regularSpace,
    }}
        onClick={callback}
    >
        {
            !icon ? null :
                <Icon
                    theme={theme}
                    name={icon}
                    margin={regularSpace}
                />
        }
        <span css={{
            margin: regularSpace,
            ...fontCss({ theme, fontSize: 'xsmall' }),
            fontFamily: theme.fontFamilies.menu,
        }}>
            {text}
        </span>
    </div>;
}
