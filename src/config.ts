function prodConfig() {
    return {
        libUrl: 'https://booka-lib.herokuapp.com',
    };
}

function debugConfig(): AppConfig {
    return {
        ...prodConfig(),
        libUrl: 'http://localhost:3141',
    };
}

export function config() {
    return process.env.NODE_ENV === 'development'
        ? debugConfig()
        : prodConfig();
}
export type AppConfig = ReturnType<typeof prodConfig>;
