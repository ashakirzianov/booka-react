import React from 'react';
import { Themed } from '../core';
import { LibraryCard, KnownTag } from 'booka-common';
import { TagLabel, View, regularSpace } from '../controls';

export function TagList({ card, theme }: Themed & {
    card: LibraryCard,
}) {
    return <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: regularSpace,
    }}>
        {
            card.tags.map((tag, idx) =>
                <TabButton
                    key={idx}
                    theme={theme}
                    tag={tag}
                />)
        }
    </View>;
}

function TabButton({ tag, theme }: Themed & {
    tag: KnownTag,
}) {
    switch (tag.tag) {
        case 'subject':
            return <TagLabel
                theme={theme}
                color='blue'
                text={tag.value}
            />;
        case 'language':
            return <TagLabel
                theme={theme}
                color='green'
                text={`Language: ${tag.value.toUpperCase()}`}
            />;
        case 'pg-index':
            return <TagLabel
                theme={theme}
                color='red'
                text='Project Gutenberg'
            />;
        default:
            return null;
    }
}
