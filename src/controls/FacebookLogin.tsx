import * as React from 'react';
import { View } from 'react-native';

import {
    FbLoginState, fbState, doFbLogin,
} from '../application';
import { Themed } from './theme';
import { Icon } from './Icon';
import {
    point, buttonStyle, fontCss, regularSpace, buttonHeight,
} from './common';

type SocialButtonProps = Themed & {
    onStatusChange?: () => void,
};

export type FacebookLoginProps = SocialButtonProps;
export function FacebookLogin({ theme, onStatusChange }: FacebookLoginProps) {
    const [loginState, setLoginState] = React.useState<FbLoginState>({ state: 'checking' });
    React.useEffect(() => {
        const sub = fbState().subscribe(setLoginState);
        return () => sub.unsubscribe();
    }, [setLoginState]);
    React.useEffect(() => {
        if (onStatusChange) {
            onStatusChange();
            // Note: HACK: need to set timeout to update popover properly
            setTimeout(onStatusChange, 200);
        }
    }, [loginState, onStatusChange]);

    return <View>
        <ActualButton
            theme={theme}
            callback={() => {
                if (loginState.state !== 'logged' || !loginState.token) {
                    doFbLogin();
                }
            }}
            user={
                loginState.state === 'logged' && loginState.name
                    ? { name: loginState.name, pictureUrl: loginState.picture }
                    : undefined
            }
        />
    </View>;
}

type ActualButtonProps = Themed & {
    callback: () => void,
    user?: {
        name: string,
        pictureUrl?: string,
    },
};
function ActualButton({ callback, user, theme }: ActualButtonProps) {
    const text = user
        ? `Continue as ${user.name}`
        : 'Continue with facebook';
    return <button
        onClick={callback}
        style={{
            ...buttonStyle,
            color: 'white',
            background: '#4469b0',
            borderStyle: 'none',
            cursor: 'pointer',
            padding: 0,
        }}
    >
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: point(15),
            height: buttonHeight,
        }}>
            <View style={{
                marginLeft: regularSpace,
                flexGrow: 0,
                flexShrink: 0,
            }}>
                <Icon
                    theme={theme}
                    name='facebook'
                    size={point(2)}
                />
            </View>
            <View style={{
                flexGrow: 1,
                flexShrink: 1,
            }}>
                <span style={{
                    ...fontCss({ theme, fontSize: 'xsmall' }),
                    margin: regularSpace,
                    textAlign: 'center',
                    whiteSpace: 'pre',
                }}>
                    {text}
                </span>
            </View>
            <View style={{
                flexGrow: 0,
                flexShrink: 0,
            }}>
                {
                    user && user.pictureUrl
                        ? <img
                            alt=''
                            src={user.pictureUrl}
                        />
                        : null
                }
            </View>
        </div>
    </button >;
}
