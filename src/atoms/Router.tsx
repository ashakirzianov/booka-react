import { Router, Link, HistoryLocation } from '@reach/router';

export type RouteProps = {
    path: string,
    location?: HistoryLocation,
    [k: string]: any,
};
export { Router, Link };
