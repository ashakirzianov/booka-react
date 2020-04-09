// eslint-disable-next-line
import React, {
    ReactNode, useState, useCallback, MouseEvent, TouchEvent,
} from 'react';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Popper } from 'react-popper';
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
    if (state === undefined) {
        return null;
    }
    const anchorRef = virtualRef(state.top, state.left);

    return <Popper
        referenceElement={anchorRef}
        placement='bottom-start'
        modifiers={[{
            name: 'offset',
            options: {
                offset: [20, 20],
            },
        }]}
    >
        {
            ({ ref, style, placement }) =>
                <div ref={ref} style={{
                    ...style,
                    zIndex: 100,
                }}
                    data-placement={placement}
                >
                    <OverlayPanel
                        theme={theme}
                        width={menuWidth}
                    >
                        {children}
                    </OverlayPanel>
                </div>
        }
    </Popper>;
}

function virtualRef(top: number, left: number) {
    return {
        getBoundingClientRect() {
            return {
                top,
                left,
                bottom: top,
                right: left,
                width: 0,
                height: 0,
            };
        },
    };
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
        onMouseUp={callback}
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
        onMouseUp={callback}
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
