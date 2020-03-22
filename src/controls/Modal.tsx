import * as React from 'react';
import { View } from 'react-native';
import { Transition } from 'react-transition-group';

import { Themed, getFontFamily, getFontSize, colors } from '../application';
import { HasChildren, semiTransparent, buttonHeight } from './common';
import { defaultAnimationDuration } from './Animations';
import { OverlayPanel } from './Panel';
import { IconButton } from './IconButton';

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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'fixed',
                top: 0, bottom: 0, left: 0, right: 0,
                backgroundColor: semiTransparent,
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
                    <View style={{ flex: 1 }}>
                        <ModalTitle
                            theme={theme}
                            title={title}
                            close={close}
                        />
                        <View style={{
                            flex: 1,
                            alignItems: 'stretch',
                            overflow: 'scroll',
                        }}
                        >
                            {children}
                        </View>
                    </View>
                </OverlayPanel>
            </div>
        }
    </Transition>;
}

function ModalTitle({ theme, title, close }: Themed & {
    title: string | undefined,
    close: () => void,
}) {
    return <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }}>
        <View style={{
            flexGrow: 0,
            flexShrink: 0,
        }}>
            <IconButton
                theme={theme}
                onClick={close}
                icon='close'
            />
        </View>
        <View style={{
            flexShrink: 1,
            flexGrow: 1,
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
            // TODO: rethink this hack
            flexGrow: 0,
            flexShrink: 10,
            width: buttonHeight,
        }} />
    </View>;
}
