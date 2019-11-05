import { Observable, Subscription } from 'rxjs';

export function withPartial<T>(actual: Observable<T>, partial: Observable<T>): Observable<T> {
    return new Observable(observer => {
        let partialSub: Subscription | undefined;
        let needToRunPartial = true;
        const actualSub = actual.subscribe({
            complete() {
                observer.complete();
            },
            error(err) {
                observer.error(err);
            },
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
                next(value) {
                    observer.next(value);
                },
                error(err) {
                    observer.error(err);
                },
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
