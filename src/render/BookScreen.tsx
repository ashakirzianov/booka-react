import React from 'react';

import {
    AugmentedBookFragment, BookPath,
} from 'booka-common';
import {
    useTheme, useBook, useBookId,
} from '../application';
import { Themed } from '../core';
import {
    View, readingAreaWidth, FullScreenActivityIndicator,
    Screen, megaSpace, doubleSpace,
} from '../controls';
import { BookView } from './BookView';
import { TableOfContentsModal } from './TableOfContentsModal';
import { Header, Footer } from './BookScreenControls';

export function BookScreen() {
    const theme = useTheme();
    const bookState = useBook();
    const bookId = useBookId();
    if (!bookId) {
        return null;
    } else if (bookState.fragment.loading) {
        return <FullScreenActivityIndicator
            theme={theme}
        />;
    } else {
        return <BookReady
            theme={theme}
            bookId={bookId}
            controlsVisible={bookState.controls}
            scrollPath={bookState.scrollPath}
            fragment={bookState.fragment}
        />;
    }
}

function BookReady({
    theme, fragment, bookId,
    controlsVisible, scrollPath,
}: Themed & {
    bookId: string,
    fragment: AugmentedBookFragment,
    controlsVisible: boolean,
    scrollPath: BookPath | undefined,
}) {
    return <Screen theme={theme}>
        <Header
            theme={theme}
            bookId={bookId}
            visible={controlsVisible}
        />
        <Footer
            theme={theme}
            fragment={fragment}
            visible={controlsVisible}
        />
        <TableOfContentsModal bookId={bookId} />
        <View style={{
            width: '100%',
            alignItems: 'center',
        }}
        >
            <View style={{
                maxWidth: readingAreaWidth,
                paddingTop: megaSpace, paddingBottom: megaSpace,
                paddingLeft: doubleSpace, paddingRight: doubleSpace,
            }}>
                <BookView
                    fragment={fragment}
                    bookId={bookId}
                    scrollPath={scrollPath}
                />
            </View>
        </View>
    </Screen>;
}
