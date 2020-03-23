import React from 'react';
import { LibraryCard } from 'booka-common';
import { BookTile, ActivityIndicator } from '../controls';
import { useLibraryCard, useTheme, Loadable } from '../application';
import { Themed } from '../core';
import { ShowCardLink } from './Navigation';

export function BookIdTile({ bookId }: {
    bookId: string,
}) {
    const { theme } = useTheme();
    const { card } = useLibraryCard(bookId);
    return <LibraryCardLink
        theme={theme}
        card={card}
    />;
}

export function LibraryCardLink({ card, theme }: Themed & {
    card: Loadable<LibraryCard>,
}) {
    if (card.loading) {
        return <ActivityIndicator theme={theme} />;
    } else {
        return <ShowCardLink bookId={card.id}>
            <BookTile
                theme={theme}
                title={card.title}
                author={card.author}
                coverUrl={card.coverUrl}
            />
        </ShowCardLink>;
    }
}

export function LibraryCardTile({ card, theme }: Themed & {
    card: LibraryCard,
}) {
    return <BookTile
        theme={theme}
        title={card.title}
        author={card.author}
        coverUrl={card.coverUrl}
        hideShadow={true}
    />;
}
