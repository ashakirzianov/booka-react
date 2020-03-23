import { parse, stringify } from 'query-string';
import { CurrentPosition } from 'booka-common';

export function updateSearch(search: string, key: string, value: string | undefined | null) {
    const obj = parse(search);
    obj[key] = value;
    const result = stringify(obj);
    return result ? `?${result}` : '';
}

export type Loadable<T> = {
    loading: true,
} | ({
    loading?: false,
} & T);

export function mostRecentPosition(positions: CurrentPosition[]): CurrentPosition | undefined {
    return positions.length === 0
        ? undefined
        : positions.reduce(
            (most, curr) => most.created < curr.created ? curr : most,
        );
}
