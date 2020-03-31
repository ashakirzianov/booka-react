import { switchMap } from 'rxjs/operators';
import {
    replaceOrAdd, BookPath, CurrentPosition, localCurrentPosition,
} from 'booka-common';
import { LocalChange, LocalChangeStore } from './localChange';
import { Api } from './api';
import { config } from '../config';

const source = config().source;
export function currentPositionsProvider(localChangeStore: LocalChangeStore, api: Api) {
    return {
        currentPositions() {
            return api.getCurrentPositions().pipe(
                switchMap(ps =>
                    localChangeStore.observe(ps, applyChange),
                ),
            );
        },
        addCurrentPosition({ path, bookId }: {
            path: BookPath,
            bookId: string,
        }) {
            const created = new Date(Date.now());
            localChangeStore.addChange({
                change: 'current-position-update',
                position: localCurrentPosition({
                    created, source, path, bookId,
                }),
            });
        },
    };
}

function applyChange(positions: CurrentPosition[], change: LocalChange): CurrentPosition[] {
    switch (change.change) {
        case 'current-position-update': {
            return replaceOrAdd(
                positions,
                p => p.bookId === change.position.bookId && p.source === change.position.source,
                change.position,
            );
        }
        default:
            return positions;
    }
}
