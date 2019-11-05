import { AppAction, ActionForType } from './app';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';

type TransformObservable<T, U> = (o: Observable<T>) => Observable<U>;
export function ofAppType<T extends AppAction['type']>(
    ...types: T[]
): TransformObservable<AppAction, ActionForType<T>> {
    return ofType(...types) as any;
}
