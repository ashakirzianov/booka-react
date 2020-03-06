import {
    BookPath, HighlightGroup, BookRange, Bookmark, Highlight,
} from 'booka-common';

type DefChange<Key extends string> = {
    change: Key,
};

type AddBookmarkChange = DefChange<'bookmark-add'> & {
    bookmark: Bookmark,
};

type RemoveBookmarkChange = DefChange<'bookmark-remove'> & {
    bookmarkId: string,
};

type AddHighlightChange = DefChange<'highlight-add'> & {
    highlight: Highlight,
};

type RemoveHighlightChange = DefChange<'highlight-remove'> & {
    highlightId: string,
};

type UpdateHighlightChange = DefChange<'highlight-update'> & {
    highlightId: string,
    group?: HighlightGroup,
};

type UpdateCurrentPositionChange = DefChange<'current-position-update'> & {
    bookId: string,
    path: BookPath,
};

export type LocalChange =
    | AddBookmarkChange | RemoveBookmarkChange
    | AddHighlightChange | RemoveHighlightChange | UpdateHighlightChange
    | UpdateCurrentPositionChange
    ;

let local: LocalChange[] = [];
export function addLocalChange(change: LocalChange) {
    local = [...local, change];
}

export function removeLocalChange(change: LocalChange) {
    local = local.filter(c => c !== change);
}

export function applyLocalChanges<T>(state: T, reducer: (s: T, ch: LocalChange) => T): T {
    return local.reduce(reducer, state);
}
