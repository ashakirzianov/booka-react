import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { debounce } from 'lodash';

import {
    useLibrarySearch, SearchState, useTheme, useSetSearchQuery,
} from '../application';
import {
    TextInput, ActivityIndicator, Panel, userAreaWidth, Label,
} from '../controls';
import { Themed } from '../core';
import { AccountButton } from './AccountButton';
import { AppearanceButton } from './AppearanceButton';
import { BookList } from './BookList';
import { UploadButton } from './UploadButton';

export function TopBar({ query }: {
    query: string | undefined,
}) {
    const { theme } = useTheme();
    const searchState = useLibrarySearch(query);
    const doQuery = useSetSearchQuery();
    const querySearch = React.useCallback(debounce((q: string) => {
        doQuery(q ? q : undefined);
    }, 300), [doQuery]);
    return <Layout
        Input={<TextInput
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
        Results={<SearchResults
            theme={theme}
            state={searchState}
            query={query}
        />}
    />;
}

function SearchResults({ query, state, theme }: Themed & {
    query: string | undefined,
    state: SearchState,
}) {
    if (!query) {
        return null;
    } else if (state.loading) {
        return <Panel theme={theme}>
            <ActivityIndicator theme={theme} />
        </Panel>;
    } else if (state.results.length === 0) {
        return <Panel theme={theme}>
            <Label
                theme={theme}
                text='Nothing found'
            />
        </Panel>;
    } else {
        return <Panel theme={theme}>
            <BookList
                theme={theme}
                books={state.results.map(r => r.card)}
                lines={2}
            />
        </Panel>;
    }
}

function Layout({ Input, Buttons, Results }: {
    Input: ReactNode,
    Buttons: ReactNode,
    Results: ReactNode,
}) {
    return <View style={{
        flexDirection: 'column',
        flexBasis: 'auto',
        height: 'auto',
        justifyContent: 'flex-start',
    }}>
        <View style={{
            flexDirection: 'row',
            flexBasis: 'auto',
            flexGrow: 1,
            flexShrink: 1,
            justifyContent: 'space-between',
        }}>
            <View style={{
                flexBasis: 1,
                flexGrow: 1,
                flexShrink: 1,
            }} />
            <View style={{
                width: userAreaWidth,
                maxWidth: userAreaWidth,
                flexBasis: 'auto',
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
        </View>
        {Results}
    </View>;
}
