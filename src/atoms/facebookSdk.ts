/*global globalThis*/
import { BehaviorSubject, Observable } from 'rxjs';

export type FbLoginState =
    | { state: 'checking' }
    | { state: 'not-logged' }
    | { state: 'logged', token?: string, name?: string, picture?: string }
    ;

export function fbState(): Observable<FbLoginState> {
    return fbStateSubject;
}

export async function startupFbSdk(clientId: string) {
    initFbSdk(clientId);
    const status = await getLoginStatus();
    broadcastStateFromStatus(status);
}

export async function doFbLogin() {
    const status = await loginFbSdk();
    broadcastStateFromStatus(status);
}

export async function doFbLogout() {
    const status = await logoutFbSdk();
    broadcastStateFromStatus(status);
}

const fbStateSubject = new BehaviorSubject<FbLoginState>({
    state: 'not-logged',
});

function broadcastStateFromStatus(status: fb.StatusResponse) {
    if (status.status === 'connected') {
        fbStateSubject.next({
            state: 'logged',
            token: status.authResponse.accessToken,
        });
        globalThis.FB.api('/me', { fields: 'picture,first_name' }, response => {
            const anyResp = response as any;
            const picUrl = anyResp.picture
                && anyResp.picture.data
                && anyResp.picture.data.url;
            if (anyResp.first_name) {
                fbStateSubject.next({
                    state: 'logged',
                    name: anyResp.first_name,
                    token: status.authResponse.accessToken,
                    picture: picUrl,
                });
            }
        });
    } else {
        fbStateSubject.next({ state: 'not-logged' });
    }
}

async function loginFbSdk(): Promise<fb.StatusResponse> {
    const sdk = await getFbSdk();
    return new Promise(res => sdk.login(res));
}

async function logoutFbSdk(): Promise<fb.StatusResponse> {
    const sdk = await getFbSdk();
    return new Promise(res => sdk.logout(res));
}

async function getLoginStatus(): Promise<fb.StatusResponse> {
    const sdk = await getFbSdk();
    return new Promise(res => sdk.getLoginStatus(res));
}

async function getFbSdk(attempts: number = 10): Promise<fb.FacebookStatic> {
    if (globalThis.FB) {
        return globalThis.FB;
    } else if (attempts > 0) {
        return new Promise(resolve => setTimeout(async () => {
            const sdk = await getFbSdk(attempts - 1);
            resolve(sdk);
        }, 1000));
    } else {
        return new Promise((_, rej) => rej(`Couldn't init fb sdk`));
    }
}

function initFbSdk(clientId: string) {
    if (globalThis.FB) {
        return;
    }
    let timeout = 0;
    (window as any).fbAsyncInit = function asyncInit() {
        if (globalThis.FB) {
            globalThis.FB.init({
                appId: clientId,
                cookie: true,
                xfbml: true,
                version: 'v4.0',
            });
        } else {
            setTimeout(asyncInit(), timeout);
            timeout += 1000;
        }
    };

    loadSdk();
}

function loadSdk() {
    (function (d, s, id) {
        let js: any;
        const fjs: any = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}
