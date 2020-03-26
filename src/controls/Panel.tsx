import React from 'react';
import {
    HasChildren, percent, panelShadow, userAreaWidth,
    normalMargin, panelHeight, Size, radius,
} from './common';
import { Themed, colors, getFontFamily, getFontSize } from './theme';
import { defaultAnimationDuration } from './Animations';
import { View } from 'react-native';

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
        margin: normalMargin,
        maxWidth: userAreaWidth,
        justifyContent: 'flex-start',
        width: '100%',
        alignSelf: 'center',
    }}>
        {
            title ?
                <div style={{
                    display: 'flex',
                    alignSelf: 'flex-start',
                    margin: normalMargin,
                }}>
                    <span style={{
                        fontSize: getFontSize(theme, 'small'),
                        fontFamily: getFontFamily(theme, 'menu'),
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
            marginLeft: normalMargin, marginRight: normalMargin,
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
    return <View style={{
        flexShrink: 1,
        width: width ?? percent(100),
        maxWidth: userAreaWidth,
        maxHeight: '100%',
        overflow: 'scroll',
        zIndex: 10,
        backgroundColor: colors(theme).secondary,
        boxShadow: panelShadow(colors(theme).shadow),
        borderRadius: radius,
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
    </View>;
}
