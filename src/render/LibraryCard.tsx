import React from 'react';

import {
    LibraryCard, getLocationsData,
} from 'booka-common';
import { BookCoverComp, Column, Modal } from '../atoms';
import {
    useTheme, useAppDispatch, useAppSelector, useLibraryCardData,
} from '../application';
import { LinkToPath } from './Navigation';

export function LibraryCardComp({ bookId }: {
    bookId: string,
}) {
    const cardState = useLibraryCardData(bookId);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const collections = useAppSelector(s => s.collections.collections);
    const { positions } = useAppSelector(s => s.currentPositions);
    const readingListCards = collections['reading-list'] ?? [];

    // TODO: rethink
    const closeCard = React.useCallback(() => dispatch({
        type: 'card-close',
    }), [dispatch]);

    const addToReadingList = React.useCallback((card: LibraryCard) => dispatch({
        type: 'collections-add-card',
        payload: {
            collection: 'reading-list',
            card,
        },
    }), [dispatch]);
    const removeFromReadingList = React.useCallback((card: LibraryCard) => dispatch({
        type: 'collections-remove-card',
        payload: {
            collection: 'reading-list',
            card,
        },
    }), [dispatch]);

    const currentPosition = positions.find(
        p => p.card.id === bookId
    );
    const isInReadingList = readingListCards.find(c => c.id === bookId) !== undefined;
    const locationsData = currentPosition && getLocationsData(currentPosition);
    const continueReadPosition = locationsData?.mostRecent;
    return <Modal
        theme={theme}
        toggle={closeCard}
        open={true}
    >
        <Column>
            {
                // TODO: extract to separate components
                cardState.state === 'loading'
                    ? <span>Loading...</span>
                    : <>
                        <BookCoverComp card={cardState.card} />
                        <span>{cardState.card.title}</span>
                        <LinkToPath bookId={cardState.card.id}>Read from start</LinkToPath>
                        {
                            continueReadPosition
                                ? <LinkToPath
                                    bookId={cardState.card.id}
                                    path={continueReadPosition.path}
                                >
                                    Continue reading
                                    </LinkToPath>
                                : null
                        }
                        {
                            !isInReadingList
                                ? <span
                                    onClick={
                                        () => addToReadingList(cardState.card)
                                    }>
                                    Add to reading list
                                    </span>
                                : <span
                                    onClick={
                                        () => removeFromReadingList(cardState.card)
                                    }
                                >
                                    Remove from reading list
                                    </span>
                        }
                    </>
            }

        </Column>
    </Modal>;
}
