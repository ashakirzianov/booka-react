import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { CurrentPosition } from 'booka-common';
import {
    usePositions, useTheme, Themed,
} from '../application';
import { Panel, ActionButton } from '../controls';
import { ParagraphPreview } from './ParagraphPreview';
import { BookIdTile } from './LibraryCardTile';
import { BookPathLink } from './Navigation';

export function CurrentBook() {
    const { theme } = useTheme();
    const { positions } = usePositions();
    if (positions.length === 0) {
        return null;
    }

    const mostRecent = positions.reduce(
        (most, curr) => most.created < curr.created
            ? curr : most,
    );

    return <Panel theme={theme} title='Current'>
        <CurrentBookContent
            theme={theme}
            position={mostRecent}
        />
    </Panel>;
}

function CurrentBookContent({ position, theme }: Themed & {
    position: CurrentPosition,
}) {
    return <Layout
        Tile={<BookIdTile bookId={position.bookId} />}
        Preview={<ParagraphPreview
            theme={theme}
            bookId={position.bookId}
            path={position.path}
        />}
        Continue={
            <BookPathLink
                bookId={position.bookId}
                path={position.path}
            >
                <ActionButton
                    theme={theme}
                    text='Continue'
                    color='neutral'
                />
            </BookPathLink>
        }
    />;
}

function Layout({ Tile, Preview, Continue }: {
    Tile: ReactNode,
    Preview: ReactNode,
    Continue: ReactNode,
}) {
    return <View style={{
        flexDirection: 'row',
        minHeight: 0,
        width: '100%',
        height: 240,
    }}>
        {Tile}
        <View style={{
            flexDirection: 'column',
            flexShrink: 1,
            maxHeight: '100%',
            width: '100%',
            minHeight: 0,
        }}>
            {Preview}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
            }}>
                {Continue}
            </View>
        </View>
    </View>;
}
