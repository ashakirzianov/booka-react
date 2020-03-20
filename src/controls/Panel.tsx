import React from 'react';
import { View } from 'react-native';
import { HasChildren, percent, point, boxShadow, userAreaWidth } from './common';
import { Themed, colors } from '../application';
import { defaultAnimationDuration } from './Animations';
import { Column } from '../atoms';

export function TitledPanel({ children, theme }: HasChildren & Themed & {
    title: string,
}) {
    return <Panel theme={theme}>
        {children}
    </Panel>;
}

export function Panel({ theme, children }: HasChildren & Themed) {
    return <div style={{
        display: 'flex',
        flex: 1,
        flexShrink: 1,
        boxShadow: boxShadow(colors(theme).shadow),
        margin: point(1),
        width: userAreaWidth,
        flexWrap: 'wrap',
        alignSelf: 'center',
    }}>
        {children}
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
