import * as React from 'react';
import { View } from 'react-native';

import {
    FbLoginState, fbState, doFbLogin,
} from '../application';
import { Themed } from './theme';
import { Icon } from './Icon';
import { point } from './common';

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
            onClick={() => {
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
    onClick: () => void,
    user?: {
        name: string,
        pictureUrl?: string,
    },
};
function ActualButton({ onClick, user, theme }: ActualButtonProps) {
    const text = user
        ? `Continue as ${user.name}`
        : 'Continue with facebook';
    return <button
        onClick={onClick}
        style={{
            color: 'white',
            background: '#4469b0',
            borderStyle: 'none',
            borderRadius: 3,
            cursor: 'pointer',
            padding: 0,
        }}
    >
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <div style={{ marginLeft: point(0.5) }}>
                <Icon
                    theme={theme}
                    name='facebook'
                    size={point(2)}
                />
            </div>
            <span style={{
                fontSize: point(1.5),
                fontFamily: 'Helvetica',
                margin: point(0.5),
                whiteSpace: 'pre',
            }}>
                {text}
            </span>
            {
                user && user.pictureUrl
                    ? <img
                        alt=''
                        src={user.pictureUrl}
                    />
                    : null
            }
        </View>
    </button>;
}
