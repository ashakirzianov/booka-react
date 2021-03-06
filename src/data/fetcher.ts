import {
    ApiContract, MethodNames, PathMethodContract,
    AllowedPaths, Contract,
} from 'booka-common';
import { map } from 'rxjs/operators';
import { AjaxRequest, ajax } from 'rxjs/ajax';
import { Observable } from 'rxjs';

export type FetchReturn<C extends PathMethodContract> = C['return'];

export type FetchParam<C extends PathMethodContract> = Omit<C, 'return' | 'files'> & {
    extra?: {
        headers?: object,
        postData?: any,
    },
};

export type FetchMethod<C extends ApiContract, M extends MethodNames> =
    <Path extends AllowedPaths<C, M>>(path: Path, param: FetchParam<Contract<C, M, Path>>)
        => Observable<FetchReturn<Contract<C, M, Path>>>;
export type Fetcher<C extends ApiContract> = {
    [m in MethodNames]: FetchMethod<C, m>;
};

export function createFetcher<C extends ApiContract>(baseUrl: string): Fetcher<C> {
    function buildFetchMethod<M extends MethodNames>(method: M): FetchMethod<C, M> {
        return (path, param) => {
            const url = baseUrl + replaceParams(path, param.params) + queryToString(param.query);
            const formData = param.extra && param.extra.postData;
            const body = formData || param.body;
            const req: AjaxRequest = {
                url, method, body,
                responseType: 'json',
                headers: {
                    ...(!formData && { 'Content-Type': 'application/json' }),
                    ...param.extra && param.extra.headers,
                    ...param.auth && { Authorization: `Bearer ${param.auth}` },
                },
            };
            return ajax(req).pipe(
                map(res => {
                    return res.response;
                }),
            );
        };
    }

    return {
        get: buildFetchMethod('get'),
        post: buildFetchMethod('post'),
        patch: buildFetchMethod('patch'),
        put: buildFetchMethod('put'),
        delete: buildFetchMethod('delete'),
    };
}

function replaceParams(url: string, params?: object): string {
    if (params) {
        const replaced = Object.keys(params)
            .reduce((u, key) => u.replace(`:${key}`, (params as any)[key]), url);
        return replaced;
    } else {
        return url;
    }
}

function queryToString(query?: object): string {
    if (query) {
        const s = Object
            .entries(query)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return value
                        .map(v => `${key}=${v}`)
                        .join(',');
                } else {
                    return `${key}=${value}`;
                }
            })
            .join('&');
        return `?${s}`;
    } else {
        return '';
    }
}
