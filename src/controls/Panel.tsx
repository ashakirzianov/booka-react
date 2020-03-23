import React from 'react';
import {
    HasChildren, percent, point, panelShadow, userAreaWidth,
    normalMargin, panelHeight,
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
        flexBasis: 1,
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
                <span style={{
                    display: 'flex',
                    alignSelf: 'flex-start',
                    marginLeft: normalMargin, marginRight: normalMargin,
                    fontSize: getFontSize(theme, 'small'),
                    fontFamily: getFontFamily(theme, 'menu'),
                    color: colors(theme).text,
                }}>
                    {title}
                </span>
                : null
        }
        <div style={{
            display: 'flex',
            alignSelf: 'stretch',
            alignItems: 'center',
            minHeight: panelHeight,
            marginLeft: normalMargin, marginRight: normalMargin,
            justifyContent: 'center',
        }}>
            {children}
        </div>
    </div>;
}

export function OverlayPanel({
    theme, animation, children,
}: HasChildren & Themed & {
    animation?: {
        entered: boolean,
    },
}) {
    return <View style={{
        overflow: 'scroll',
        backgroundColor: colors(theme).secondary,
        width: percent(100),
        maxWidth: point(50),
        maxHeight: percent(100),
        minHeight: panelHeight,
        boxShadow: panelShadow(colors(theme).shadow),
        zIndex: 10,
        // TODO: rethink this
        ...(animation && {
            transitionDuration: `${defaultAnimationDuration}ms`,
            transform: animation.entered
                ? []
                : [{ translateY: '100%' }],
        } as any),
    }}
    >
        <div onClick={e => e.stopPropagation()} style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
        }}>
            {children}
        </div>
    </View>;
}
