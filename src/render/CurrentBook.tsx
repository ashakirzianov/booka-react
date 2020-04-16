import React from 'react';

import { CurrentPosition, pageForPosition, LibraryCard } from 'booka-common';
import {
    usePositions, useTheme, usePathData, useLibraryCard,
} from '../application';
import { Loadable, Themed, colors } from '../core';
import {
    userAreaWidth, pageEffect, tripleSpace, doubleSpace, fontCss,
    megaSpace, ActivityIndicator,
} from '../controls';
import { CardLink, BookPathLink } from './Navigation';

export function CurrentBookPanel() {
    const positions = usePositions();
    if (positions.length === 0) {
        return null;
    }

    const mostRecent = positions.reduce(
        (most, curr) => most.created < curr.created
            ? curr : most,
    );
    return <CurrentBook position={mostRecent} />;
}

function CurrentBook({ position }: {
    position: CurrentPosition,
}) {
    const theme = useTheme();
    const pathData = usePathData(position.bookId, position.path);
    const card = useLibraryCard(position.bookId);
    const page = pathData.loading
        ? pathData
        : `${pageForPosition(pathData.position)} of ${pageForPosition(pathData.of)}`;
    const preview = pathData.loading
        ? pathData : pathData.preview;
    return <CurrentBookView
        theme={theme}
        position={position}
        card={card}
        preview={preview}
        page={page}
    />;
}

function CurrentBookView({
    card, position, preview, page, theme,
}: Themed & {
    position: CurrentPosition,
    card: Loadable<LibraryCard>,
    preview: Loadable<string>,
    page: Loadable<string>,
}) {
    if (card.loading) {
        return null;
    }
    return <div css={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: userAreaWidth,
        alignSelf: 'center',
        backgroundColor: colors(theme).primary,
        ...pageEffect(colors(theme).shadow),
    }}>
        <div css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <CardLink bookId={card.id}>
                <div css={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    paddingTop: tripleSpace,
                    paddingBottom: doubleSpace,
                    color: colors(theme).accent,
                    ...fontCss({
                        theme,
                        fontFamily: 'book',
                        fontSize: 'small',
                        bold: true,
                    }),
                    '&:hover': {
                        color: colors(theme).highlight,
                    },
                }}>
                    {card.title}
                </div>
            </CardLink>
            <BookPathLink bookId={position.bookId} path={position.path}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingLeft: megaSpace,
                    paddingRight: megaSpace,
                }}>
                    {
                        preview.loading
                            ? <ActivityIndicator theme={theme} />
                            : <Preview
                                theme={theme}
                                text={preview}
                            />
                    }
                    <span css={{
                        color: colors(theme).accent,
                        marginTop: doubleSpace,
                        marginBottom: tripleSpace,
                        ...fontCss({
                            theme,
                            fontFamily: 'book',
                            fontSize: 'small',
                        }),
                    }}>
                        {page.loading ? '' : page}
                    </span>
                </div>
            </BookPathLink>
        </div>
    </div>;
}

function Preview({ text, theme }: Themed & {
    text: string,
}) {
    return <p css={{
        display: '-webkit-box',
        WebkitLineClamp: 10,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'break-spaces',
        textAlign: 'justify',
        color: colors(theme).text,
        ...fontCss({
            theme,
            fontFamily: 'book',
            fontSize: 'small',
        }),
        padding: 0,
        margin: 0,
        textIndent: megaSpace,
    }}>
        {text}
    </p>;
}
