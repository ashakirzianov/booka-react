import { AppAction, ActionForType, AppState } from './app';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { filter, map } from 'rxjs/operators';

type TransformObservable<T, U> = (o: Observable<T>) => Observable<U>;
export function ofAppType<T extends AppAction['type']>(
    ...types: T[]
): TransformObservable<AppAction, ActionForType<T>> {
    return ofType(...types) as any;
}

export function appAuth(state$: Observable<AppState>) {
    return state$.pipe(
        map(state =>
            state.account.state === 'signed'
                ? state.account.token
                : undefined
        ),
        filter(token => token !== undefined),
        map(token => token!),
    );
}

// TODO: move to 'common' ?
export function replaceOrAdd<T>(arr: T[], pred: (x: T) => boolean, replacement: T): T[] {
    let isReplaced = false;
    const result = arr.map(x => {
        if (!isReplaced && pred(x)) {
            isReplaced = true;
            return replacement;
        } else {
            return x;
        }
    });
    return isReplaced
        ? result
        : [...result, replacement];
}
