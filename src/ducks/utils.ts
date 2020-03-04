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
