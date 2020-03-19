import { parse, stringify } from 'query-string';

export function updateSearch(search: string, key: string, value: string | undefined | null) {
    const obj = parse(search);
    obj[key] = value;
    const result = stringify(obj);
    return result ? `?${result}` : '';
}
