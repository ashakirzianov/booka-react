// eslint-disable-next-line
import React, {
    ReactNode, useState, useCallback, MouseEvent, TouchEvent,
} from 'react';
import { debounce } from 'lodash';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import Tippy from '@tippyjs/react';
import 'tippy.js/animations/shift-away.css';

import { Themed, colors } from '../core';
import {
    HasChildren, regularSpace, fontCss, menuWidth, panelShadow, radius,
} from './common';
import { IconName, Icon } from './Icon';
import { useOnScroll, useOnSelection } from '../application';

type ContextMenuState = undefined | {
    top: number,
    left: number,
};
export function ContextMenu({
    children, theme, trigger, onTrigger,
}: HasChildren & Themed & {
    trigger: ReactNode,
    id: string,
    onTrigger: () => boolean,
}) {
    const [state, setState] = useState<ContextMenuState>(undefined);
    const closeMenu = useCallback(() => {
        if (state) {
            setState(undefined);
        }
    }, [state, setState]);
    useOnScroll(closeMenu);
    useOnSelection(debounce(closeMenu, 300));
    const mouseHandler = useCallback((e: MouseEvent) => {
        const show = onTrigger();
        if (show) {
            e.preventDefault();
            setState({
                top: e.clientY,
                left: e.clientX,
            });
        }
    }, [onTrigger, setState]);
    const touchHandler = useCallback((e: TouchEvent) => {
        const touch = e.touches[0];
        if (touch && onTrigger()) {
            e.preventDefault();
            setState({
                top: touch.clientY,
                left: touch.clientX,
            });
        }
    }, [onTrigger, setState]);

    return <div
        onClick={mouseHandler}
        onContextMenu={mouseHandler}
        onTouchEnd={touchHandler}
    >
        <ContextMenuBody state={state} theme={theme}>
            {children}
        </ContextMenuBody>
        {trigger}
    </div>;
}

function ContextMenuBody({ state, theme, children }: HasChildren & Themed & {
    state: ContextMenuState,
}) {
    return <div css={{
        // pointerEvents: 'auto',
        '& .tippy-box[data-theme~=\'custom\']': {
            backgroundColor: colors(theme).secondary,
            boxShadow: panelShadow(colors(theme).shadow),
            borderRadius: radius,
            width: menuWidth,
        },
    }}>
        <Tippy
            visible={state !== undefined}
            interactive={true}
            arrow={false}
            theme='custom'
            placement='bottom-start'
            animation='shift-away'
            offset={[20, 20]}
            content={
                <div style={{
                    display: state ? 'block' : 'none',
                }}>
                    {children}
                </div>
            }
        >
            <div style={{
                position: 'fixed',
                top: state?.top,
                left: state?.left,
            }} />
        </Tippy>
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
        // width: '100%',
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
