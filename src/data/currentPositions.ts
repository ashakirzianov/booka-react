import { switchMap } from 'rxjs/operators';
import {
    ResolvedCurrentPosition, AuthToken,
    replaceOrAdd, BookPath, LibraryCard,
} from 'booka-common';
import { LocalChange, LocalChangeStore } from './localChange';
import { api } from './api';

export function currentPositionsProvider(localChangeStore: LocalChangeStore) {
    return {
        currentPositions(token?: AuthToken) {
            return api().getCurrentPositions(token).pipe(
                switchMap(ps =>
                    localChangeStore.observe(ps, applyChange)
                )
            );
        },
        addCurrentPosition(params: {
            path: BookPath,
            preview: string | undefined,
            card: LibraryCard,
        }) {
            const created = new Date(Date.now());
            localChangeStore.addChange({
                change: 'current-position-update',
                created,
                ...params,
            });
        },
    };
}

const source = 'not-implemented';
function applyChange(positions: ResolvedCurrentPosition[], change: LocalChange): ResolvedCurrentPosition[] {
    switch (change.change) {
        case 'current-position-update': {
            const { card, path, created, preview } = change;
            const existing = positions.find(cp => cp.card.id === card.id);
            if (existing) {
                const locations = replaceOrAdd(
                    existing.locations,
                    l => l.source === source,
                    { source, path, created, preview }
                );
                const replacement = { ...existing, locations };
                return positions.map(
                    cp => cp === existing ? replacement : cp
                );
            } else {
                const toAdd: ResolvedCurrentPosition = {
                    card,
                    locations: [{
                        source, path, created, preview,
                    }],
                };
                return [toAdd, ...positions];
            }
        }
        default:
            return positions;
    }
}
