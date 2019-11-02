import * as React from 'react';
import { Callback, AccountInfo } from 'booka-common';

import {
    Column, FacebookLogin, SocialLoginResult, PictureButton, Row, point,
    WithPopover, TextLine, IconButton, TagButton, Themed,
} from '../atoms';
import { AccountState } from '../ducks';
import { useAppDispatch, useAppSelector, useTheme } from '../core';

export function ConnectedAccountButton() {
    const theme = useTheme();
    const account = useAppSelector(s => s.account);
    const dispatch = useAppDispatch();

    const onLogin = React.useCallback((result: SocialLoginResult) => {
        if (result.provider === 'facebook') {
            dispatch({
                type: 'account-fb-token',
                payload: {
                    token: result.token,
                },
            });
        }
    }, [dispatch]);
    const logout = React.useCallback(() => dispatch({
        type: 'account-logout',
    }), [dispatch]);

    return <AccountButton
        theme={theme}
        account={account}
        onLogin={onLogin}
        logout={logout}
    />;
}

type AccountButtonProps = Themed & {
    account: AccountState,
    logout: Callback,
    onLogin: Callback<SocialLoginResult>,
};
function AccountButton({
    account, theme,
    logout, onLogin,
}: AccountButtonProps) {
    return <WithPopover
        theme={theme}
        popoverPlacement='bottom'
        body={
            account.state === 'signed'
                ? <AccountPanel
                    theme={theme}
                    account={account.account}
                    logout={logout}
                />
                : ({ scheduleUpdate }) =>
                    <SignInPanel
                        onStatusChanged={scheduleUpdate}
                        onLogin={onLogin}
                    />
        }
    >
        <ActualButton
            theme={theme}
            account={account}
        />
    </WithPopover>;
}

type ActualButtonProps = Themed & {
    account: AccountState,
    onClick?: Callback,
};
function ActualButton({ theme, account, onClick }: ActualButtonProps) {
    if (account.state === 'signed') {
        return <PictureButton
            theme={theme}
            pictureUrl={account.account.pictureUrl}
            onClick={onClick}
        />;
    } else {
        return <IconButton
            theme={theme}
            icon='sign-in'
            onClick={onClick}
        />;
    }
}

type AccountPanelProps = Themed & {
    account: AccountInfo,
    logout: Callback,
};
function AccountPanel({ account, theme, logout }: AccountPanelProps) {
    return <Column>
        <Row margin={point(1)} centered>
            <TextLine
                theme={theme}
                text={account.name}
                fontSize='small'
            />
        </Row>
        <Row margin={point(1)} centered>
            <TagButton
                theme={theme}
                text='Logout'
                onClick={logout}
            />
        </Row>
    </Column>;
}

type SignInPanelProps = {
    onStatusChanged?: Callback,
    onLogin: Callback<SocialLoginResult>,
};
function SignInPanel({ onStatusChanged, onLogin }: SignInPanelProps) {
    return <Column>
        <FacebookLogin
            onStatusChange={onStatusChanged}
            onLogin={onLogin}
        />
    </Column>;
}
