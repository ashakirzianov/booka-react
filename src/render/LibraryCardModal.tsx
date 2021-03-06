import React, { useCallback, ReactNode } from 'react';
import { View } from 'react-native';

import {
    LibraryCard, BookPath, firstPath, pageForPosition, CurrentPosition,
} from 'booka-common';
import {
    useTheme, useLibraryCard,
    useCollection, usePositions, useSetCardId, useCollectionActions, useCardId,
} from '../application';
import {
    Modal, ActivityIndicator, ActionButton,
    regularSpace, Label, Icon,
} from '../controls';
import { LibraryCardTile } from './LibraryCardTile';
import { ParagraphPreview } from './ParagraphPreview';
import { TagList } from './TagList';
import { BookPathLink } from './Navigation';

export function LibraryCardModal() {
    const bookId = useCardId();
    if (bookId) {
        return <LibraryCardModalImpl bookId={bookId} />;
    } else {
        return null;
    }
}

function LibraryCardModalImpl({ bookId }: {
    bookId: string,
}) {
    const theme = useTheme();
    const card = useLibraryCard(bookId);
    const setCard = useSetCardId();

    return <Modal
        theme={theme}
        title=''
        close={() => setCard(undefined)}
        open={true}
    >
        {
            card.loading
                ? <ActivityIndicator theme={theme} />
                : <Layout
                    Cover={<LibraryCardTile theme={theme} card={card} />}
                    Title={<Label
                        theme={theme}
                        text={card.title}
                        color='text'
                    />}
                    Author={<Label
                        theme={theme}
                        text={`by ${card.author ?? 'unknown'}`}
                        italic
                        color='accent'
                        fontSize='xsmall'
                    />}
                    Read={<ReadButtons card={card} />}
                    Continue={<ContinueRead card={card} />}
                    Tags={<TagList theme={theme} card={card} />}
                    Length={<View style={{
                        flexDirection: 'row',
                        padding: regularSpace,
                    }}>
                        <Icon
                            theme={theme}
                            name='pages'
                            color='accent'
                        />
                        <Label
                            theme={theme}
                            text={`${pageForPosition(card.length)} pages`}
                            fontSize='xsmall'
                            color='accent'
                        />
                    </View>}
                />
        }
    </Modal>;
}

function ReadButtons({ card }: {
    card: LibraryCard,
}) {
    return <View style={{
        flexDirection: 'row',
        flexGrow: 1,
        flexShrink: 1,
        flexWrap: 'wrap',
        marginBottom: regularSpace,
        justifyContent: 'flex-end',
    }}>
        <ReadingListButton card={card} />
        <BookPathButton
            bookId={card.id}
            text='From Start'
        />
    </View>;
}

function ContinueRead({ card }: {
    card: LibraryCard,
}) {
    const theme = useTheme();
    const positions = usePositions();

    const currentPositions = positions.filter(
        p => p.bookId === card.id,
    );
    const continueReadPosition = mostRecentPosition(currentPositions);
    const continuePath = continueReadPosition?.path;

    return <View style={{
        padding: regularSpace,
    }}>
        <Label
            theme={theme}
            text={continuePath
                ? 'Continue reading'
                : 'Book preview'
            }
            fontSize='xsmall'
            color='accent'
        />
        <ParagraphPreview
            theme={theme}
            bookId={card.id}
            path={continuePath ?? firstPath()}
        />
    </View>;
}

function ReadingListButton({ card }: {
    card: LibraryCard,
}) {
    const theme = useTheme();
    const collectionState = useCollection('reading-list');
    const {
        addToCollection,
        removeFromCollection,
    } = useCollectionActions('reading-list');
    const readingListCards = collectionState.loading
        ? []
        : collectionState;
    const addToReadingList = useCallback(
        () => addToCollection(card),
        [addToCollection, card],
    );
    const removeFromReadingList = useCallback(
        () => removeFromCollection(card.id),
        [removeFromCollection, card],
    );
    const isInReadingList = readingListCards.find(c => c.id === card.id) !== undefined;
    if (isInReadingList) {
        return <ActionButton
            theme={theme}
            text='Not To Read'
            color='negative'
            callback={removeFromReadingList}
        />;
    } else {
        return <ActionButton
            theme={theme}
            text='To Read'
            color='positive'
            callback={addToReadingList}
        />;
    }
}

function BookPathButton({ text, bookId, path }: {
    text: string,
    bookId: string,
    path?: BookPath,
}) {
    const theme = useTheme();
    return <BookPathLink bookId={bookId} path={path}>
        <ActionButton
            theme={theme}
            text={text}
            color='neutral'
        />
    </BookPathLink>;
}

function Layout({
    Cover, Title, Author, Read, Tags, Continue, Length,
}: {
    Cover: ReactNode,
    Title: ReactNode,
    Author: ReactNode,
    Length: ReactNode,
    Read: ReactNode,
    Continue: ReactNode,
    Tags: ReactNode,
}) {
    return <View style={{
        padding: regularSpace,
        paddingTop: 0,
    }}>
        <View style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'flex-start',
        }}>
            <View style={{
                flexGrow: 0,
                minWidth: 'auto',
                marginRight: regularSpace,
            }}>
                {Cover}
            </View>
            <View style={{
                flexGrow: 1,
                flexShrink: 1,
            }}>
                <View style={{
                    margin: regularSpace,
                }}>
                    {Title}
                    {Author}
                </View>
                {Tags}
                {Length}
                {Read}
            </View>
        </View>
        <View>
            {Continue}
        </View>
    </View>;
}

function mostRecentPosition(positions: CurrentPosition[]): CurrentPosition | undefined {
    return positions.length === 0
        ? undefined
        : positions.reduce(
            (most, curr) => most.created < curr.created ? curr : most,
        );
}
