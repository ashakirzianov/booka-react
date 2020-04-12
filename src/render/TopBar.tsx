import React, { ReactNode, useCallback } from 'react';
import { View } from 'react-native';
import { debounce } from 'lodash';
import {
    useSearch, useTheme, useDoSearch, useSearchQuery,
} from '../application';
import {
    SearchInput, ActivityIndicator, Panel, userAreaWidth, Label,
} from '../controls';
import { AccountButton } from './AccountButton';
import { AppearanceButton } from './AppearanceButton';
import { BookList } from './BookList';
import { UploadButton } from './UploadButton';

export function TopBar() {
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
        Results={<SearchResults />}
    />;
}

function SearchResults() {
    const theme = useTheme();
    const state = useSearch();
    switch (state.state) {
        case 'empty':
            return null;
        case 'loading':
            return <Panel theme={theme}>
                <ActivityIndicator theme={theme} />
            </Panel>;
        case 'ready':
            if (state.results.length === 0) {
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
        default:
            return null;
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
