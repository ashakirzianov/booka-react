import * as React from 'react';
import { AccountInfo } from 'booka-common';

import { AccountState } from '../ducks';
import { useTheme, useAccount, Themed } from '../application';
import {
    Column, Row, WithPopover, point, FacebookLogin,
    PictureButton, IconButton, Label, ActionButton,
} from '../controls';

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

function ActualButton({ theme, account, onClick }: Themed & {
    account: AccountState,
    onClick?: () => void,
}) {
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

function AccountPanel({ account, theme, logout }: Themed & {
    account: AccountInfo,
    logout: () => void,
}) {
    return <Column>
        <Row margin={point(1)} centered>
            <Label
                theme={theme}
                text={account.name}
            />
        </Row>
        <Row margin={point(1)} centered>
            <ActionButton
                theme={theme}
                text='Logout'
                onClick={logout}
            />
        </Row>
    </Column>;
}

function SignInPanel({ theme, onStatusChanged }: Themed & {
    onStatusChanged?: () => void,
}) {
    return <Column>
        <FacebookLogin
            theme={theme}
            onStatusChange={onStatusChanged}
        />
    </Column>;
}
