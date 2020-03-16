import { of } from 'rxjs';
import { assertNever } from 'booka-common';
import { Api } from './api';
import { LocalChange } from './localChange';

export function postLocalChange(api: Api, change: LocalChange) {
    switch (change.change) {
        case 'bookmark-add':
            return api.postAddBookmark(change.bookmark);
        case 'bookmark-remove':
            return api.postRemoveBookmark(change.bookmarkId);
        case 'highlight-add':
            return api.postAddHighlight(change.highlight);
        case 'highlight-remove':
            return api.postRemoveHighlight(change.highlightId);
        case 'highlight-update':
            return api.postUpdateHighlight({
                _id: change.highlightId,
                group: change.group,
            });
        case 'collection-add':
            return api.postAddToCollection(change.card.id, change.collection);
        case 'collection-remove':
            return api.postRemoveFromCollection(change.bookId, change.collection);
        case 'current-position-update':
            return api.postAddCurrentPosition({
                bookId: change.card.id,
                source: 'not-implemented',
                path: change.path,
                created: change.created,
            });
        default:
            assertNever(change);
            return of<{}>();
    }
}
