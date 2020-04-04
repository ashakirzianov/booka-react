import { AppAction } from './app';
import { Observable, of } from 'rxjs';
import { Api } from '../data/api';

export function syncWorker(api: Api) {
    let queue: AppAction[] = [];
    let current: AppAction | undefined;
    function takeNext() {
        if (!current) {
            const [head, ...tail] = queue;
            if (head) {
                current = head;
                queue = tail;
                doPost(current, 5);
            }
        }
    }
    function doPost(action: AppAction, retries: number) {
        postAction(action, api).subscribe({
            complete() {
                current = undefined;
                takeNext();
            },
            error() {
                if (retries > 0) {
                    doPost(action, retries - 1);
                } else {
                    current = undefined;
                    queue = [action, ...queue];
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

    return {
        enqueue(action: AppAction) {
            queue = appendAction(queue, action);
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
        case 'positions-add':
            return [
                ...queue.filter(
                    a => a.type !== 'positions-add'
                        // Note: next line is really not necessary
                        // || a.payload.source.id !== action.payload.source.id
                        || a.payload.bookId !== action.payload.bookId,
                ),
                action,
            ];
        case 'bookmarks-add':
        case 'bookmarks-remove':
        case 'highlights-add':
        case 'highlights-remove':
        case 'highlights-change-group':
        case 'collections-add':
        case 'collections-remove':
            return [...queue, action];
        default:
            return queue;
    }
}

function postAction(action: AppAction, api: Api): Observable<unknown> {
    switch (action.type) {
        case 'bookmarks-add':
            return api.postAddBookmark(action.payload);
        case 'bookmarks-remove':
            return api.postRemoveBookmark(action.payload.bookmarkId);
        case 'highlights-add':
            return api.postAddHighlight(action.payload);
        case 'highlights-remove':
            return api.postRemoveHighlight(action.payload.highlightId);
        case 'highlights-change-group':
            return api.postUpdateHighlight({
                uuid: action.payload.highlightId,
                group: action.payload.group,
            });
        case 'collections-add':
            return api.postAddToCollection(action.payload.card.id, action.payload.name);
        case 'collections-remove':
            return api.postRemoveFromCollection(action.payload.bookId, action.payload.name);
        case 'positions-add':
            return api.postAddCurrentPosition(action.payload);
        default:
            return of();
    }
}
