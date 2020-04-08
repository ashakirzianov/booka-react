import { AppAction } from './app';
import { Observable, of } from 'rxjs';
import { DataProvider } from '../data';
import { SyncStorage } from '../core';

export type SyncWorker = ReturnType<typeof createSyncWorker>;
export function createSyncWorker({ storage, dataProvider }: {
    storage: SyncStorage,
    dataProvider: DataProvider,
}) {
    let queue: AppAction[] = restore();
    let current: AppAction | undefined;

    function restore() {
        return storage.restore() ?? [];
    }
    function store() {
        storage.store(queue);
    }
    function takeNext() {
        if (!current && dataProvider.isSigned()) {
            const [head, ...tail] = queue;
            if (head) {
                current = head;
                queue = tail;
                doPost(current, 5);
            }
        }
    }
    function doPost(action: AppAction, retries: number) {
        postAction(action, dataProvider).subscribe({
            complete() {
                current = undefined;
                store();
                takeNext();
            },
            error() {
                if (retries > 0) {
                    doPost(action, retries - 1);
                } else {
                    current = undefined;
                    queue = [action, ...queue];
                    store();
                }
            },
        });
    }
    function allActions(): AppAction[] {
        if (current) {
            return [current, ...queue];
        } else {
            return queue;
        }
    }

    takeNext();

    return {
        enqueue(action: AppAction) {
            queue = appendAction(queue, action);
            store();
            takeNext();
        },
        reduce<T>(state: T, reducer: (s: T, action: AppAction) => T): T {
            return allActions().reduce(reducer, state);
        },
        wake() {
            takeNext();
        },
    };
}

function appendAction(queue: AppAction[], action: AppAction): AppAction[] {
    switch (action.type) {
        case 'positions/add':
            return [
                ...queue.filter(
                    a => a.type !== 'positions/add'
                        // Note: next line is really not necessary
                        // || a.payload.source.id !== action.payload.source.id
                        || a.payload.bookId !== action.payload.bookId,
                ),
                action,
            ];
        case 'bookmarks/add':
        case 'bookmarks/remove':
        case 'highlights/add':
        case 'highlights/remove':
        case 'highlights/change-group':
        case 'collections/add':
        case 'collections/remove':
            return [...queue, action];
        default:
            return queue;
    }
}

function postAction(action: AppAction, dp: DataProvider): Observable<unknown> {
    switch (action.type) {
        case 'bookmarks/add':
            return dp.postAddBookmark(action.payload);
        case 'bookmarks/remove':
            return dp.postRemoveBookmark(action.payload.bookmarkId);
        case 'highlights/add':
            return dp.postAddHighlight(action.payload);
        case 'highlights/remove':
            return dp.postRemoveHighlight(action.payload.highlightId);
        case 'highlights/change-group':
            return dp.postUpdateHighlight({
                uuid: action.payload.highlightId,
                group: action.payload.group,
            });
        case 'collections/add':
            return dp.postAddToCollection(action.payload.card.id, action.payload.name);
        case 'collections/remove':
            return dp.postRemoveFromCollection(action.payload.bookId, action.payload.name);
        case 'positions/add':
            return dp.postAddCurrentPosition(action.payload);
        default:
            return of();
    }
}
