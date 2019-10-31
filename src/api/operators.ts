import { Observable, Subscription } from 'rxjs';

export function withPartial<T>(actual: Observable<T>, partial: Observable<T>): Observable<T> {
    return new Observable(observer => {
        let partialSub: Subscription | undefined;
        let needToRunPartial = true;
        const actualSub = actual.subscribe({
            ...observer,
            next(value) {
                if (partialSub) {
                    partialSub.unsubscribe();
                }
                needToRunPartial = false;
                observer.next(value);
            },
        });
        if (needToRunPartial) {
            partialSub = partial.subscribe({
                ...observer,
                complete() { return; },
            });
        }
        return {
            unsubscribe() {
                actualSub.unsubscribe();
                if (partialSub) {
                    partialSub.unsubscribe();
                }
            },
        };
    });
}
