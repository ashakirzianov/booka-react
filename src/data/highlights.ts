import { switchMap, map } from 'rxjs/operators';
import {
    Highlight, BookRange, HighlightGroup, localHighlight,
} from 'booka-common';
import { LocalChange, LocalChangeStore } from './localChange';
import { Api } from './api';

export function highlightsProvider(localChangeStore: LocalChangeStore, api: Api) {
    return {
        highlightsForId(bookId: string) {
            return api.getHighlights(bookId).pipe(
                switchMap(hs =>
                    localChangeStore.observe(hs, applyChange).pipe(
                        map(localHs => localHs.filter(h => h.bookId === bookId))
                    ),
                ),
            );
        },
        addHighlight(bookId: string, range: BookRange, group: HighlightGroup) {
            localChangeStore.addChange({
                change: 'highlight-add',
                highlight: localHighlight({
                    bookId, range, group,
                }),
            });
        },
        removeHighlight(highlightId: string) {
            localChangeStore.addChange({
                change: 'highlight-remove',
                highlightId,
            });
        },
        updateHighlightGroup(highlightId: string, group: HighlightGroup) {
            localChangeStore.addChange({
                change: 'highlight-update',
                highlightId, group,
            });
        },
    };
}

function applyChange(highlights: Highlight[], change: LocalChange): Highlight[] {
    switch (change.change) {
        case 'highlight-add':
            return [...highlights, change.highlight];
        case 'highlight-remove':
            return highlights.filter(h => h.uuid !== change.highlightId);
        case 'highlight-update':
            return highlights.map(
                h => h.uuid === change.highlightId
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
