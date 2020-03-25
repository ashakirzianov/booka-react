import * as React from 'react';
import { View } from 'react-native';
import { Transition } from 'react-transition-group';

import { Themed, getFontFamily, getFontSize, colors } from './theme';
import {
    HasChildren, doubleMargin, normalPadding, panelHeight,
} from './common';
import { defaultAnimationDuration } from './Animations';
import { OverlayPanel } from './Panel';
import { IconButton } from './Buttons';

export type ModalProps = Parameters<typeof Modal>[0];
export function Modal({
    title, close, open, theme, children,
}: HasChildren & Themed & {
    open: boolean,
    title?: string,
    close: () => void,
}) {
    return <Transition in={open} timeout={300}>
        {state => state === 'exited' ? null :
            <div style={{
                position: 'fixed',
                top: 0, bottom: 0, left: 0, right: 0,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors(theme).semiTransparent,
                zIndex: 10,
                transition: `${defaultAnimationDuration}ms ease-in-out`,
                opacity: state === 'entered' ? 1 : 0.01,
            }}
                onClick={close}
            >
                <OverlayPanel
                    animation={{
                        entered: state === 'entered',
                    }}
                    theme={theme}>
                    <ModalTitle
                        theme={theme}
                        title={title}
                        close={close}
                    />
                    <View style={{
                        flexGrow: 1,
                        flexShrink: 1,
                        overflow: 'scroll',
                        padding: normalPadding,
                        justifyContent: 'flex-start',
                    }}
                    >
                        {children}
                    </View>
                </OverlayPanel>
            </div>
        }
    </Transition >;
}

function ModalTitle({ theme, title, close }: Themed & {
    title: string | undefined,
    close: () => void,
}) {
    if (title === undefined) {
        return null;
    }
    return <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }}>
        <View style={{
            minWidth: 'auto',
            flexBasis: 1,
            flexGrow: 1,
            flexShrink: 1,
        }}>
            <IconButton
                theme={theme}
                callback={close}
                icon='close'
            />
        </View>
        <View style={{
            flexBasis: 'auto',
            flexGrow: 1,
            flexShrink: 1,
            marginLeft: doubleMargin,
        }}>
            <span title={title} style={{
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: getFontFamily(theme, 'menu'),
                fontSize: getFontSize(theme, 'normal'),
                color: colors(theme).text,
            }}>
                {title}
            </span>
        </View>
        <View style={{
            flexBasis: 1,
            flexGrow: 1,
            flexShrink: 1,
        }} />
    </View>;
}
