import * as React from 'react';

import { Column, Row } from './Layout';
import { Icon } from './Icons';
import { point, Callback } from './common';
import { FbLoginState, fbState, doFbLogin } from './facebookSdk';

type SocialLoginProvider = 'facebook';
export type SocialLoginResult = {
    token: string,
    provider: SocialLoginProvider,
};

type SocialButtonProps = {
    onLogin: Callback<SocialLoginResult>,
    onStatusChange?: Callback,
};

export type FacebookLoginProps = SocialButtonProps;
export function FacebookLogin({ onLogin, onStatusChange }: FacebookLoginProps) {
    const [loginState, setLoginState] = React.useState<FbLoginState>({ state: 'checking' });
    React.useEffect(() => {
        fbState().subscribe(setLoginState);
    }, [setLoginState]);
    React.useEffect(() => {
        if (onStatusChange) {
            onStatusChange();
            // Note: HACK: need to set timeout to update popover properly
            setTimeout(onStatusChange, 200);
        }
    }, [loginState, onStatusChange]);

    return <Column>
        <ActualButton
            onClick={() => {
                if (loginState.state === 'logged' && loginState.token) {
                    onLogin({
                        provider: 'facebook',
                        token: loginState.token,
                    });
                } else {
                    doFbLogin();
                }
            }}
            user={
                loginState.state === 'logged' && loginState.name
                    ? { name: loginState.name, pictureUrl: loginState.picture }
                    : undefined
            }
        />
    </Column>;
}

type ActualButtonProps = {
    onClick: Callback<void>,
    user?: {
        name: string,
        pictureUrl?: string,
    },
};
function ActualButton({ onClick, user }: ActualButtonProps) {
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
        <Row centered justified>
            <div style={{ marginLeft: point(0.5) }}>
                <Icon name='facebook' size={point(2)} />
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
        </Row>
    </button>;
}
