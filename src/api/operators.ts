import { Observable } from 'rxjs';

export function withPartial<T>(actual: Observable<T>, partial: Observable<T>): Observable<T> {
    return new Observable(observer => {
        const actualSub = actual.subscribe({
            ...observer,
            next(value) {
                if (partialSub) {
                    partialSub.unsubscribe();
                }
                observer.next(value);
            },
        });
        const partialSub = partial.subscribe(observer);
        return {
            unsubscribe() {
                actualSub.unsubscribe();
                partialSub.unsubscribe();
            },
        };
    });
}
