// eslint-disable-next-line
import React, { ReactNode, Fragment, useRef, MouseEvent } from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
    ContextMenu as Menu, ContextMenuTrigger, MenuItem as Item,
} from 'react-contextmenu';

import { Themed, colors } from '../core';
import {
    HasChildren, regularSpace, fontCss,
} from './common';
import { IconName, Icon } from './Icon';
import { OverlayPanel } from './Panel';

export function ContextMenu({
    children, theme, id, trigger, enabled,
}: HasChildren & Themed & {
    trigger: ReactNode,
    id: string,
    enabled: boolean,
}) {
    type EventType = MouseEvent;
    type RefType = {
        handleContextClick: (e: EventType) => void,
    };
    const menuRef = useRef<RefType>();
    function toggleMenu(event: EventType) {
        if (enabled && menuRef.current) {
            menuRef.current.handleContextClick(event);
        }
    }
    return <Fragment>
        <ContextMenuTrigger
            id={id}
            ref={ref => menuRef.current = ref as any}
        >
            <div
                onClick={toggleMenu}
            >
                {trigger}
            </div>
        </ContextMenuTrigger>
        <Menu id={id}>
            <OverlayPanel theme={theme}>
                {children}
            </OverlayPanel>
        </Menu>
    </Fragment>;
}

export function ContextMenuItem({ callback, theme, children }: HasChildren & Themed & {
    callback?: () => void,
}) {
    return <Item
        onClick={callback}
    >
        <div css={{
            display: 'flex',
            flexBasis: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: regularSpace,
        }}
        >
            {children}
        </div>
    </Item>;
}

export function TextContextMenuItem({
    theme, callback, icon, text,
}: Themed & {
    text: string,
    icon?: IconName,
    callback?: () => void,
}) {
    return <Item onClick={callback}>
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
            padding: regularSpace,
        }}
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
        </div>
    </Item>;
}
