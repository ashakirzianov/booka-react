import * as React from 'react';
import { AccountInfo } from 'booka-common';

import { AccountState } from '../ducks';
import { useTheme, useAccount } from '../application';
import {
    WithPopover, FacebookLogin, View,
    PictureButton, IconButton, Label, ActionButton, point, doubleMargin,
} from '../controls';
import { Themed } from '../core';

export function AccountButton() {
    const { theme } = useTheme();
    const { accountState, logout } = useAccount();

    return <AccountButtonDumb
        theme={theme}
        account={accountState}
        logout={logout}
    />;
}

function AccountButtonDumb({
    account, theme, logout,
}: Themed & {
    account: AccountState,
    logout: () => void,
}) {
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
                        theme={theme}
                        onStatusChanged={scheduleUpdate}
                    />
        }
    >
        <ActualButton
            theme={theme}
            account={account}
        />
    </WithPopover>;
}

function ActualButton({ theme, account, callback }: Themed & {
    account: AccountState,
    callback?: () => void,
}) {
    if (account.state === 'signed') {
        return <PictureButton
            theme={theme}
            pictureUrl={account.account.pictureUrl}
            callback={callback}
        />;
    } else {
        return <IconButton
            theme={theme}
            icon='sign-in'
            callback={callback}
        />;
    }
}

function AccountPanel({ account, theme, logout }: Themed & {
    account: AccountInfo,
    logout: () => void,
}) {
    return <View style={{
        height: point(10),
        alignItems: 'center',
        justifyContent: 'space-around',
        margin: doubleMargin,
    }}>
        <Label
            theme={theme}
            text={account.name}
        />
        <ActionButton
            theme={theme}
            text='Logout'
            callback={logout}
        />
    </View>;
}

function SignInPanel({ theme, onStatusChanged }: Themed & {
    onStatusChanged?: () => void,
}) {
    return <FacebookLogin
        theme={theme}
        onStatusChange={onStatusChanged}
    />;
}
