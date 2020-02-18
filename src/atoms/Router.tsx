import { Router, Link, HistoryLocation, navigate } from '@reach/router';

export type RouteProps = {
    path: string,
    location?: HistoryLocation,
    [k: string]: any,
};
export { Link, Router, navigate };
