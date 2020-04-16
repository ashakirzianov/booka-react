import React, { ReactNode, useCallback } from 'react';
import { View } from 'react-native';
import { debounce } from 'lodash';
import {
    useTheme, useDoSearch, useSearchQuery,
} from '../application';
import {
    SearchInput, point,
} from '../controls';
import { AccountButton } from './AccountButton';
import { AppearanceButton } from './AppearanceButton';
import { UploadButton } from './UploadButton';

export function AppBar() {
    const theme = useTheme();
    const query = useSearchQuery();
    const doQuery = useDoSearch();
    const querySearch = useCallback(debounce((q: string) => {
        doQuery(q ? q : undefined);
    }, 300), [doQuery]);
    return <Layout
        Input={<SearchInput
            theme={theme}
            placeholder='Search books...'
            initial={query}
            onChange={querySearch}
        />}
        Buttons={<>
            <UploadButton />
            <AppearanceButton />
            <AccountButton />
        </>}
    />;
}

function Layout({ Input, Buttons }: {
    Input: ReactNode,
    Buttons: ReactNode,
}) {
    return <View style={{
        flexDirection: 'row',
        flexBasis: 'auto',
        flexGrow: 1,
        flexShrink: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: point(7),
    }}>
        <View style={{
            flexBasis: 1,
            flexGrow: 1,
            flexShrink: 1,
        }} />
        <View style={{
            minWidth: 'auto',
            flexBasis: 1,
            flexGrow: 1,
            flexShrink: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {Input}
        </View>
        <View style={{
            minWidth: 'auto',
            flexBasis: 1,
            flexGrow: 1,
            flexShrink: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
        }}>
            {Buttons}
        </View>
    </View>;
}
