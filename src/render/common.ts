import {
    BookPositionLocator, pathToString,
} from 'booka-common';

export function linkForLocation(location: BookPositionLocator): string {
    return `/book/${location.id}?p=${pathToString(location.path)}`;
}
