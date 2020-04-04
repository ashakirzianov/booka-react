import { AppAction } from './app';
import { Observable } from 'rxjs';
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
    // TODO: implement action reducing here
    return [...queue, action];
}

function postAction(action: AppAction, api: Api): Observable<unknown> {
    switch (action.type) {
        default:
            return new Observable(s => s.complete());
    }
}
