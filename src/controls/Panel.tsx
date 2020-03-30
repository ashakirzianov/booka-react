import React from 'react';
import {
    HasChildren, percent, panelShadow, userAreaWidth,
    regularSpace, panelHeight, Size, radius, fontCss, doubleSpace,
} from './common';
import { Themed, colors } from './theme';
import { defaultAnimationDuration } from './Animations';

export function Panel({ theme, title, children }: HasChildren & Themed & {
    title?: string,
}) {
    return <div style={{
        zIndex: -10,
        display: 'flex',
        flexBasis: 'auto',
        flexShrink: 1,
        flexGrow: 1,
        flexDirection: 'column',
        maxWidth: userAreaWidth,
        justifyContent: 'flex-start',
        width: '100%',
        alignSelf: 'center',
        marginBottom: doubleSpace,
    }}>
        {
            title ?
                <div style={{
                    display: 'flex',
                    alignSelf: 'flex-start',
                    margin: regularSpace,
                }}>
                    <span style={{
                        ...fontCss({ theme }),
                        color: colors(theme).accent,
                    }}>
                        {title}
                    </span>
                </div>
                : null
        }
        <div style={{
            display: 'flex',
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: panelHeight,
            marginLeft: regularSpace, marginRight: regularSpace,
        }}>
            {children}
        </div>
    </div>;
}

export function OverlayPanel({
    theme, width, animation, children,
}: HasChildren & Themed & {
    width?: Size,
    animation?: {
        entered: boolean,
    },
}) {
    return <div style={{
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 1,
        width: width ?? percent(100),
        maxWidth: userAreaWidth,
        maxHeight: '100%',
        overflow: 'scroll',
        zIndex: 10,
        backgroundColor: colors(theme).secondary,
        boxShadow: panelShadow(colors(theme).shadow),
        borderRadius: radius,
        pointerEvents: 'auto',
        // TODO: rethink this
        ...(animation && {
            transitionDuration: `${defaultAnimationDuration}ms`,
            transform: animation.entered
                ? []
                : [{ translateY: '100%' }],
        } as any),
    }}
    >
        {children}
    </div>;
}
