import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { throttle } from 'lodash';

import {
    useLibrarySearch, SearchState, Themed, useTheme,
} from '../application';
import {
    TextInput, Column, ActivityIndicator, Panel, BookList, point,
} from '../controls';
import { AccountButton } from './AccountButton';
import { AppearanceButton } from './AppearanceButton';

export function TopBar({ query }: {
    query: string | undefined,
}) {
    const { theme } = useTheme();
    const { searchState, doQuery } = useLibrarySearch(query);
    const querySearch = React.useCallback(throttle((q: string) => {
        doQuery(q ? q : undefined);
    }, 300), [doQuery]);
    return <Layout
        Input={<TextInput
            theme={theme}
            initial={query}
            onChange={querySearch}
        />}
        Buttons={<>
            <AppearanceButton />
            <AccountButton />
        </>}
        Results={query
            ? <Panel theme={theme}>
                <SearchResults
                    theme={theme}
                    state={searchState}
                />
            </Panel>
            : null
        }
    />;
}

function SearchResults({ state, theme }: Themed & {
    state: SearchState,
}) {
    if (state.loading) {
        return <ActivityIndicator theme={theme} />;
    } else {
        return <BookList
            theme={theme}
            books={state.results.map(r => r.desc)}
        />;
    }
}

function Layout({ Input, Buttons, Results }: {
    Input: ReactNode,
    Buttons: ReactNode,
    Results: ReactNode,
}) {
    return <Column>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <View />
            <View style={{
                flexGrow: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: point(50),
            }}>
                {Input}
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
            }}>
                {Buttons}
            </View>
        </View>
        {Results}
    </Column>;
}
