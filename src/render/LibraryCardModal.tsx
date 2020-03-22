import React, { useCallback, ReactNode } from 'react';
import { View } from 'react-native';

import { LibraryCard, BookPath } from 'booka-common';
import {
    useTheme, useLibraryCard,
    useCollections, usePositions, mostRecentPosition, Themed,
} from '../application';
import { Modal, ActivityIndicator } from '../controls';
import { LibraryCardTile } from './LibraryCardTile';
import { BookPathLink } from './Navigation';

export function LibraryCardModal({ bookId }: {
    bookId: string | undefined,
}) {
    if (bookId) {
        return <LibraryCardModalImpl bookId={bookId} />;
    } else {
        return null;
    }
}

function LibraryCardModalImpl({ bookId }: {
    bookId: string,
}) {
    const { theme } = useTheme();
    const { card, closeCard } = useLibraryCard(bookId);
    const { positions } = usePositions();

    const {
        collectionsState: { collections },
        addToCollection,
        removeFromCollection,
    } = useCollections();
    const readingListCards = collections['reading-list'] ?? [];
    const addToReadingList = useCallback(
        () => !card.loading && addToCollection(card, 'reading-list'),
        [addToCollection, card],
    );
    const removeFromReadingList = useCallback(
        () => !card.loading && removeFromCollection(card.id, 'reading-list'),
        [removeFromCollection, card],
    );

    const currentPositions = positions.filter(
        p => p.bookId === bookId
    );
    const isInReadingList = readingListCards.find(c => c.id === bookId) !== undefined;
    const continueReadPosition = mostRecentPosition(currentPositions);
    return <Modal
        theme={theme}
        title={card.loading ? undefined : card.title}
        close={closeCard}
        open={true}
    >
        {
            card.loading
                ? <ActivityIndicator theme={theme} />
                : <LibraryCardView
                    theme={theme}
                    card={card}
                    continuePath={continueReadPosition?.path}
                    isInReadingList={isInReadingList}
                    addToReadingList={addToReadingList}
                    removeFromReadingList={removeFromReadingList}
                />
        }
    </Modal>;
}

function LibraryCardView({
    theme, card, continuePath,
    isInReadingList, addToReadingList, removeFromReadingList,
}: Themed & {
    card: LibraryCard,
    continuePath: BookPath | undefined,
    isInReadingList: boolean,
    addToReadingList: () => void,
    removeFromReadingList: () => void,
}) {
    return <Layout
        Cover={<LibraryCardTile theme={theme} card={card} />}
        Author={null}
        ReadSection={<>
            <BookPathLink bookId={card.id}>Read from start</BookPathLink>
            {
                continuePath
                    ? <BookPathLink
                        bookId={card.id}
                        path={continuePath}
                    >
                        Continue reading
        </BookPathLink>
                    : null
            }
            {
                isInReadingList
                    ? <span
                        onClick={addToReadingList}>
                        Add to reading list
        </span>
                    : <span
                        onClick={removeFromReadingList}
                    >
                        Remove from reading list
        </span>
            }
        </>}
        Tags={null}
    />;
}

function Layout({
    Cover, Author, ReadSection, Tags,
}: {
    Cover: ReactNode,
    Author: ReactNode,
    ReadSection: ReactNode,
    Tags: ReactNode,
}) {
    return <View style={{
        flexDirection: 'row',
    }}>
        <View style={{
            flexGrow: 0,
            minWidth: 'auto',
        }}>
            {Cover}
        </View>
        <View>
            {Author}
            {ReadSection}
            {Tags}
        </View>
    </View>;
}
