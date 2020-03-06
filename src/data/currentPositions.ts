import {
    ResolvedCurrentPosition, AuthToken, BackContract,
    replaceOrAdd, BookPath, LibraryCard,
} from 'booka-common';
import { config } from '../config';
import { LocalChange, connectedState } from './localChange';
import { createFetcher } from './fetcher';

const back = createFetcher<BackContract>(config().backUrl);
export function currentPositions(token?: AuthToken) {
    const { subject, addChange, replaceState } = connectedState([], applyChange);

    if (token) {
        back.get('/current-position', {
            auth: token.token,
        }).subscribe(r => replaceState(r.value));
    }

    function add(params: {
        path: BookPath,
        preview: string | undefined,
        card: LibraryCard,
    }) {
        const created = new Date(Date.now());
        addChange({
            change: 'current-position-update',
            created,
            ...params,
        });
    }

    return { subject, add };
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
