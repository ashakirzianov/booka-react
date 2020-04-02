// eslint-disable-next-line
import React, {
    ReactNode, Fragment, useRef, MouseEvent, TouchEvent, useCallback,
} from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
    ContextMenu as Menu, ContextMenuTrigger, MenuItem as Item,
} from 'react-contextmenu';

import { Themed, colors } from '../core';
import {
    HasChildren, regularSpace, fontCss, menuWidth,
} from './common';
import { IconName, Icon } from './Icon';
import { OverlayPanel } from './Panel';

export function ContextMenu({
    children, theme, id, trigger, onTrigger,
}: HasChildren & Themed & {
    trigger: ReactNode,
    id: string,
    onTrigger: () => boolean,
}) {
    type EventType = MouseEvent | TouchEvent;
    type RefType = {
        handleContextClick: (e: EventType) => void,
    };
    const menuRef = useRef<RefType>();
    const triggerCallback = useCallback((event: EventType) => {
        if (menuRef.current) {
            const show = onTrigger();
            if (show) {
                menuRef.current.handleContextClick(event);
            }
        }
    }, [onTrigger]);
    return <Fragment>
        <ContextMenuTrigger
            id={id}
            ref={ref => menuRef.current = ref as any}
        >
            <div
                onClick={triggerCallback}
            >
                {trigger}
            </div>
        </ContextMenuTrigger>
        <Menu id={id}>
            <OverlayPanel
                theme={theme}
                width={menuWidth}
            >
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
