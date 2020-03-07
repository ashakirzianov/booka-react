import {
    Highlight, AuthToken, BackContract, BookRange, uuid, HighlightGroup,
} from 'booka-common';
import { config } from '../config';
import { LocalChange, connectedState } from './localChange';
import { createFetcher } from './fetcher';

const back = createFetcher<BackContract>(config().backUrl);
export function highlightsForId(bookId: string, token?: AuthToken) {
    const { subject, addChange, replaceState } = connectedState([], applyChange);

    if (token) {
        back.get('/highlights', {
            query: { bookId },
            auth: token.token,
        }).subscribe(r => replaceState(r.value));
    }

    function add(range: BookRange, group: HighlightGroup) {
        addChange({
            change: 'highlight-add',
            highlight: {
                entity: 'highlight',
                _id: uuid(),
                bookId, range, group,
            },
        });
    }
    function remove(highlightId: string) {
        addChange({
            change: 'highlight-remove',
            highlightId,
        });
    }
    function updateGroup(highlightId: string, group: HighlightGroup) {
        addChange({
            change: 'highlight-update',
            highlightId,
            group,
        });
    }

    return { subject, add, remove, updateGroup };
}

function applyChange(highlights: Highlight[], change: LocalChange): Highlight[] {
    switch (change.change) {
        case 'highlight-add':
            return [...highlights, change.highlight];
        case 'highlight-remove':
            return highlights.filter(h => h._id !== change.highlightId);
        case 'highlight-update':
            return highlights.map(
                h => h._id === change.highlightId
                    ? {
                        ...h,
                        group: change.group ?? h.group,
                    }
                    : h,
            );
        default:
            return highlights;
    }
}
