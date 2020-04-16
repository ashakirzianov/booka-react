// eslint-disable-next-line
import React from 'react';
import { View } from 'react-native';
/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
    Themed, colors,
} from './theme';
import {
    Style, bookCoverWidth, panelShadow, tripleSpace, radius,
} from './common';
import { BookCover } from './BookCover';

export function BookTile({
    title, author, coverUrl, showTitle, theme, callback,
}: Themed & {
    coverUrl: string | undefined,
    title: string,
    author: string | undefined,
    showTitle?: boolean,
    callback?: () => void,
}) {
    return <div css={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        flexGrow: 0,
        width: bookCoverWidth,
        margin: tripleSpace,
        alignItems: 'center',
        color: colors(theme).text,
        fontFamily: theme.fontFamilies.book,
        borderRadius: radius,
        overflow: 'hidden',
        ...panelShadow(colors(theme).shadow),
        '&:hover': {
            color: colors(theme).highlight,
        },
    }}
        onClick={callback}
    >
        <BookCover
            theme={theme}
            title={title}
            author={author}
            coverUrl={coverUrl}
        />
        {
            !showTitle ? null :
                <BookTitle
                    theme={theme}
                    title={title}
                    author={author}
                />
        }
    </div>;
}

const overflowLine: Style = {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};
function BookTitle({ title, author, theme }: Themed & {
    title: string,
    author: string | undefined,
}) {
    return <View style={{
        maxWidth: '100%',
    }}>
        <span css={[
            overflowLine,
            {
                fontSize: theme.fontSizes.xsmall,
                fontStyle: 'italic',
                fontWeight: 100,
            },
        ]}>
            {author}
        </span>
        <span css={[
            overflowLine,
            {
                fontSize: theme.fontSizes.xsmall,
                fontWeight: 900,
            },
        ]}>
            {title || '<no-title>'}
        </span>
    </View>;
}
