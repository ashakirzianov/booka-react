import React from 'react';
import {
    useSearch, useTheme,
} from '../application';
import {
    ActivityIndicator, Panel, Label,
} from '../controls';
import { BookList } from './BookList';

export function SearchResults() {
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
