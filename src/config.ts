function prodConfig() {
    return {
        frontUrl: 'https://booka.pub',
        backUrl: 'https://reader-back.herokuapp.com',
        libUrl: 'https://booka-lib.herokuapp.com',
        facebook: { clientId: '555297378441276' },
    };
}

const useLocalServices = process.env.REACT_APP_LOCAL === 'all';
function debugConfig(): AppConfig {
    const prod = prodConfig();
    return {
        ...prod,
        frontUrl: window && window.location && window.location.hostname
            ? `https://${window.location.hostname}:3000`
            : prod.frontUrl,
        backUrl: useLocalServices
            ? 'https://localhost:3042'
            : prod.backUrl,
        libUrl: useLocalServices
            ? 'http://localhost:3141'
            : prod.libUrl,
    };
}

export function config() {
    return isDebug()
        ? debugConfig()
        : prodConfig();
}
export function whileDebug(callback: () => void) {
    if (isDebug()) {
        callback();
    }
}
export type AppConfig = ReturnType<typeof prodConfig>;

function isDebug() {
    return process.env.NODE_ENV === 'development';
}
