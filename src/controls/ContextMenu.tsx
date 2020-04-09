// eslint-disable-next-line
import React, {
    ReactNode, Fragment, useState, useCallback,
} from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';

import { Themed, colors } from '../core';
import {
    HasChildren, regularSpace, fontCss, menuWidth,
} from './common';
import { IconName, Icon } from './Icon';
import { OverlayPanel } from './Panel';
import { useOnScroll } from '../application';

type ContextMenuState = undefined | {
    top: number,
    left: number,
};
const offset = 10;
export function ContextMenu({
    children, theme, trigger, onTrigger,
}: HasChildren & Themed & {
    trigger: ReactNode,
    id: string,
    onTrigger: () => boolean,
}) {
    const [state, setState] = useState<ContextMenuState>(undefined);
    useOnScroll(useCallback(() => {
        if (state) {
            setState(undefined);
        }
    }, [state, setState]));

    return <Fragment>
        <div
            onClick={e => {
                const show = onTrigger();
                if (show) {
                    e.preventDefault();
                    setState({
                        top: e.clientY + offset,
                        left: e.clientX + offset,
                    });
                }
            }}
        >
            {
                state === undefined ? null :
                    <div style={{
                        position: 'fixed',
                        top: state.top,
                        left: state.left,
                    }}>
                        <OverlayPanel
                            theme={theme}
                            width={menuWidth}
                        >
                            {children}
                        </OverlayPanel>
                    </div>
            }
            {trigger}
        </div>
    </Fragment>;
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
