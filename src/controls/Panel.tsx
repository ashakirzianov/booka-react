import React from 'react';
import { View } from 'react-native';
import { HasChildren, percent, point, boxShadow, userAreaWidth } from './common';
import { Themed, colors, getFontFamily, getFontSize } from '../application';
import { defaultAnimationDuration } from './Animations';

export function Panel({ theme, title, children }: HasChildren & Themed & {
    title?: string,
}) {
    return <div style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        margin: point(1),
        width: userAreaWidth,
        alignItems: 'center',
        // TODO: extract
        alignSelf: 'center',
    }}>
        {
            title ?
                <span style={{
                    display: 'flex',
                    alignSelf: 'flex-start',
                    fontSize: getFontSize(theme, 'small'),
                    fontFamily: getFontFamily(theme, 'menu'),
                    margin: point(0.25),
                    color: colors(theme).text,
                }}>
                    {title}
                </span>
                : null
        }
        <div style={{
            display: 'flex',
            flex: 1,
            flexGrow: 1,
            alignSelf: 'stretch',
            boxShadow: boxShadow(colors(theme).shadow),
        }}>
            {children}
        </div>
    </div>;
}

export function OverlayPanel({ children, theme, animation }: HasChildren & Themed & {
    animation?: {
        entered: boolean,
    },
}) {
    return <View
        style={{
            alignSelf: 'center',
            overflow: 'scroll',
            backgroundColor: colors(theme).secondary,
            width: percent(100),
            maxWidth: point(50),
            maxHeight: percent(100),
            margin: '0 auto',
            borderRadius: theme.radius,
            padding: point(1),
            ...({
                boxShadow: `0px 0px 10px ${colors(theme).shadow}`,
                zIndex: 10,
            } as {}),
            ...(animation && {
                transitionDuration: `${defaultAnimationDuration}ms`,
                transform: animation.entered ? [] : [{ translateY: '100%' as any }],
            }),
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
