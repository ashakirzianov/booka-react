import React from 'react';
import {
    HasChildren, userAreaWidth, regularSpace,
    panelHeight, fontCss, doubleSpace,
} from './common';
import { Themed, colors } from './theme';

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
