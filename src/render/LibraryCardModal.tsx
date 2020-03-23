import React, { useCallback, ReactNode } from 'react';
import { View } from 'react-native';

import { LibraryCard, BookPath, firstPath, filterUndefined } from 'booka-common';
import {
    useTheme, useLibraryCard,
    useCollections, usePositions, mostRecentPosition,
    Themed, PaletteColor,
} from '../application';
import { Modal, ActivityIndicator, ActionButton, TagLabel, margin } from '../controls';
import { LibraryCardTile } from './LibraryCardTile';
import { BookPathLink } from './Navigation';
import { ParagraphPreview } from './ParagraphPreview';

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

    return <Modal
        theme={theme}
        title={card.loading ? undefined : card.title}
        close={closeCard}
        open={true}
    >
        {
            card.loading
                ? <ActivityIndicator theme={theme} />
                : <Layout
                    Cover={<LibraryCardTile theme={theme} card={card} />}
                    Author={null}
                    Read={<ReadSection card={card} />}
                    Tags={<TagList theme={theme} card={card} />}
                />
        }
    </Modal>;
}

function TagList({ card, theme }: Themed & {
    card: LibraryCard,
}) {
    const data = getTagDescs(card);
    return <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin,
    }}>
        {
            data.map(({ color, text }, idx) => {
                return <TagLabel
                    key={idx}
                    theme={theme}
                    color={color}
                    text={text}
                />;
            })
        }
    </View>;
}

type TagDesc = { color: PaletteColor, text: string };
function getTagDescs(card: LibraryCard): TagDesc[] {
    return filterUndefined(card.tags.map((tag): TagDesc | undefined => {
        switch (tag.tag) {
            case 'subject':
                return { color: 'neutral', text: tag.value };
            case 'language':
                return { color: 'positive', text: `Ln: ${tag.value}` };
            case 'pg-index':
                return { color: 'negative', text: 'Project Gutenberg' };
            default:
                return undefined;
        }
    }));
}

function ReadSection({ card }: {
    card: LibraryCard,
}) {
    const { theme } = useTheme();
    const { positions } = usePositions();

    const currentPositions = positions.filter(
        p => p.bookId === card.id
    );
    const continueReadPosition = mostRecentPosition(currentPositions);
    const continuePath = continueReadPosition?.path;
    return <View>
        <ParagraphPreview
            theme={theme}
            bookId={card.id}
            path={continuePath ?? firstPath()}
        />
        <View style={{
            flexDirection: 'row',
            flexGrow: 1,
            flexShrink: 1,
            marginTop: margin, marginBottom: margin,
            justifyContent: 'space-between',
        }}>
            <ReadingListButton card={card} />
            <View style={{
                flexDirection: 'row',
                flexShrink: 1,
            }}>
                <BookPathButton
                    theme={theme}
                    bookId={card.id}
                    text='Start'
                />
                {
                    continuePath
                        ? <BookPathButton
                            theme={theme}
                            bookId={card.id}
                            path={continuePath}
                            text='Continue'
                        />
                        : null
                }
            </View>
        </View>
    </View>;
}

function ReadingListButton({ card }: {
    card: LibraryCard,
}) {
    const { theme } = useTheme();
    const {
        collectionsState: { collections },
        addToCollection,
        removeFromCollection,
    } = useCollections();
    const readingListCards = collections['reading-list'] ?? [];
    const addToReadingList = useCallback(
        () => addToCollection(card, 'reading-list'),
        [addToCollection, card],
    );
    const removeFromReadingList = useCallback(
        () => removeFromCollection(card.id, 'reading-list'),
        [removeFromCollection, card],
    );
    const isInReadingList = readingListCards.find(c => c.id === card.id) !== undefined;
    if (isInReadingList) {
        return <ActionButton
            theme={theme}
            text='Not To Read'
            color='negative'
            onClick={removeFromReadingList}
        />;
    } else {
        return <ActionButton
            theme={theme}
            text='To Read'
            color='positive'
            onClick={addToReadingList}
        />;
    }
}

function BookPathButton({ text, theme, bookId, path }: Themed & {
    text: string,
    bookId: string,
    path?: BookPath,
}) {
    return <BookPathLink bookId={bookId} path={path}>
        <ActionButton
            theme={theme}
            text={text}
            color='neutral'
        />
    </BookPathLink>;
}

function Layout({
    Cover, Author, Read, Tags,
}: {
    Cover: ReactNode,
    Author: ReactNode,
    Read: ReactNode,
    Tags: ReactNode,
}) {
    return <View style={{
        flexDirection: 'row',
        width: '100%',
    }}>
        <View style={{
            flexGrow: 0,
            minWidth: 'auto',
        }}>
            {Cover}
        </View>
        <View style={{
            flexGrow: 1,
            flexShrink: 1,
        }}>
            {Author}
            {Read}
            {Tags}
        </View>
    </View>;
}
