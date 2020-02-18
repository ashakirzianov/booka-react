import { createBrowserHistory, LocationDescriptorObject } from 'history';

import { AppState } from '../ducks';
import { AppLink, pathForLink, queryForLink } from './link';

const history = createBrowserHistory();
export function updateHistoryFromState(state: AppState) {
    const location = locationForState(state);
    if (location) {
        history.replace(location);
    }
}

function locationForState(state: AppState): LocationDescriptorObject | undefined {
    const link = linkForState(state);
    return {
        pathname: pathForLink(link),
        search: queryForLink(link),
    };
}

function linkForState(state: AppState): AppLink {
    switch (state.screen) {
        case 'book':
            return state.book;
        case 'library':
            return {
                link: 'feed',
                card: state.library.show?.id,
            };
        default:
            return { link: 'feed' };
    }
}
