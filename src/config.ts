function prodConfig() {
    return {
        libUrl: 'https://booka-lib.herokuapp.com',
        frontUrl: 'http://booka.pub',
    };
}

function debugConfig(): AppConfig {
    const prod = prodConfig();
    return {
        ...prod,
        libUrl: 'http://localhost:3141',
        frontUrl: window && window.location && window.location.hostname
            ? `http://${window.location.hostname}:3000`
            : prod.frontUrl,
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
