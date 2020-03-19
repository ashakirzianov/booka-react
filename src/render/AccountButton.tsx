import * as React from 'react';
import { Callback, AccountInfo } from 'booka-common';

import {
    Column, FacebookLogin, PictureButton, Row, point,
    WithPopover, TextLine, IconButton, TagButton, Themed,
} from '../atoms';
import { AccountState } from '../ducks';
import { useTheme, useAccount } from '../application';

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
    logout: Callback,
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
    onClick?: Callback,
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
    logout: Callback,
}) {
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

function SignInPanel({ theme, onStatusChanged }: Themed & {
    onStatusChanged?: Callback,
}) {
    return <Column>
        <FacebookLogin
            theme={theme}
            onStatusChange={onStatusChanged}
        />
    </Column>;
}
