import React from 'react';
import {
    BookFragment,
    // Callback, BookPath, BookRange,
} from 'booka-common';

import { Themed, colors, fontSize } from '../atoms';
import { BookFragmentComp } from '../reader';

export type BookViewCompProps = Themed & {
    fragment: BookFragment,
    // pathToOpen: BookPath | null,
    // quoteRange: BookRange | undefined,
    // updateBookPosition: Callback<BookPath>,
    // openFootnote: Callback<string>,
};
export function BookViewComp({ fragment, theme }: BookViewCompProps) {
    return <BookFragmentComp
        fragment={fragment}
        color={colors(theme).text}
        refColor={colors(theme).accent}
        refHoverColor={colors(theme).highlight}
        fontSize={fontSize(theme, 'text')}
        fontFamily={theme.fontFamilies.book}
    />;
}
