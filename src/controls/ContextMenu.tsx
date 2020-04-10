// eslint-disable-next-line
import React, {
    ReactNode, useState, useCallback,
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
    height: number,
    width: number,
};
export function ContextMenu({
    children, theme, trigger, onTrigger,
}: HasChildren & Themed & {
    trigger: ReactNode,
    id: string,
    onTrigger: () => boolean,
}) {
    const [state, setState] = useState<ContextMenuState>(undefined);
    useOnScroll(useCallback((e) => {
        const rect = e.getSelectionRect();
        if (rect) {
            setState({
                top: rect.top, left: rect.left,
                width: rect.width, height: rect.height,
            });
        } else if (state) {
            setState(undefined);
        }
    }, [state, setState]));
    useOnSelection(useCallback(debounce(e => {
        const show = onTrigger();
        if (show) {
            const rect = e.getSelectionRect();
            if (rect) {
                setState(rect);
            }
        }
    }, 300), [onTrigger]));

    return <div>
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
            placement='bottom'
            animation='shift-away'
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
                pointerEvents: 'none',
                top: state?.top, left: state?.left,
                height: state?.height, width: state?.width,
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
