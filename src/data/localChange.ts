import {
    BookPath, HighlightGroup, Bookmark, Highlight, LibraryCard, CardCollectionName,
} from 'booka-common';
import { Subject, ReplaySubject, Observable, BehaviorSubject } from 'rxjs';

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
    path: BookPath,
    created: Date,
    // TODO: rethink and remove ?
    preview: string | undefined,
    card: LibraryCard,
};

type AddToCollectionChange = DefChange<'collection-add'> & {
    card: LibraryCard,
    collection: CardCollectionName,
};
type RemoveFromCollectionChange = DefChange<'collection-remove'> & {
    bookId: string
    collection: CardCollectionName,
};

export type LocalChange =
    | AddBookmarkChange | RemoveBookmarkChange
    | AddHighlightChange | RemoveHighlightChange | UpdateHighlightChange
    | UpdateCurrentPositionChange
    | AddToCollectionChange | RemoveFromCollectionChange
    ;

export function createLocalChangeStore() {
    const changesSubject = new Subject<LocalChange>();
    let changes: LocalChange[] = [];

    return {
        addChange(change: LocalChange) {
            changes = [...changes, change];
            changesSubject.next(change);
            return () => {
                changes = changes.filter(c => c !== change);
            };
        },
        observe<T>(state: T, reducer: (s: T, ch: LocalChange) => T): Observable<T> {
            state = changes.reduce(reducer, state);
            const stateSubject = new BehaviorSubject(state);
            changesSubject.subscribe(ch => {
                state = reducer(state, ch);
                stateSubject.next(state);
            });
            return stateSubject;
        },
    };
}
export type LocalChangeStore = ReturnType<typeof createLocalChangeStore>;

let local: LocalChange[] = [];
function addLocalChange(change: LocalChange) {
    local = [...local, change];
}

function removeLocalChange(change: LocalChange) {
    local = local.filter(c => c !== change);
}

function applyLocalChanges<T>(state: T, reducer: (s: T, ch: LocalChange) => T): T {
    return local.reduce(reducer, state);
}

// TODO: rename ?
export function connectedState<T>(state: T, reducer: (s: T, change: LocalChange) => T) {
    state = applyLocalChanges(state, reducer);
    const subject = new Subject<T>();
    subject.next(state);

    function replaceState(newState: T) {
        state = applyLocalChanges(newState, reducer);
        subject.next(state);
    }

    function addChange(change: LocalChange) {
        addLocalChange(change);
        state = reducer(state, change);
        subject.next(state);
        return function () {
            removeLocalChange(change);
        };
    }

    return { subject, addChange, replaceState };
}
