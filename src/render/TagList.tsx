import React from 'react';
import { Themed, PaletteColor } from '../core';
import { LibraryCard, filterUndefined } from 'booka-common';
import { TagLabel, View, regularSpace } from '../controls';

export function TagList({ card, theme }: Themed & {
    card: LibraryCard,
}) {
    const data = getTagDescs(card);
    return <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: regularSpace,
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
                return { color: 'blue', text: tag.value };
            case 'language':
                return { color: 'green', text: `Language: ${tag.value.toUpperCase()}` };
            case 'pg-index':
                return { color: 'red', text: 'Project Gutenberg' };
            default:
                return undefined;
        }
    }));
}
