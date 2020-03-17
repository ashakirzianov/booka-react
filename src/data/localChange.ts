import {
    HighlightGroup, Bookmark, Highlight,
    LibraryCard, CardCollectionName, CurrentPosition,
} from 'booka-common';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { StorageCell } from './storage';

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
    position: CurrentPosition,
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

export function createLocalChangeStore({ post, storage }: {
    post: (ch: LocalChange) => Observable<any>,
    storage: StorageCell<LocalChange[]>,
}) {
    const changesSubject = new Subject<LocalChange>();
    let changes = storage.restore() ?? [];
    changes.forEach(postChange);

    function postChange(change: LocalChange) {
        post(change).subscribe(() => {
            changes = changes.filter(c => c !== change);
            storage.store(changes);
        });
    }

    return {
        addChange(change: LocalChange) {
            changes = [...changes, change];
            storage.store(changes);
            changesSubject.next(change);
            postChange(change);
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
