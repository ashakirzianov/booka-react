import { entitySource } from './platform';
import { isDebug } from './utils';

export type AppConfig = ReturnType<typeof prodConfig>;
export function config() {
    return isDebug()
        ? debugConfig()
        : prodConfig();
}

function prodConfig() {
    return {
        frontUrl: 'https://www.booqas.com',
        backUrl: 'https://reader-back.herokuapp.com',
        libUrl: 'https://booka-lib.herokuapp.com',
        facebook: { clientId: '555297378441276' },
        source: entitySource(),
        logActions: false,
        logRenders: false,
    };
}

const useLocalLib = process.env.REACT_APP_LOCAL === 'all' || process.env.REACT_APP_LOCAL === 'lib';
const useLocalBack = process.env.REACT_APP_LOCAL === 'all' || process.env.REACT_APP_LOCAL === 'back';
function debugConfig(): AppConfig {
    const prod = prodConfig();
    return {
        ...prod,
        frontUrl: window && window.location && window.location.hostname
            ? `https://${window.location.hostname}:3000`
            : prod.frontUrl,
        backUrl: useLocalBack
            ? 'https://localhost:3042'
            : prod.backUrl,
        libUrl: useLocalLib
            ? 'https://localhost:3141'
            : prod.libUrl,
        logActions: false,
        logRenders: false,
    };
}
