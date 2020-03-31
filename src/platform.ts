import { detect } from 'detect-browser';
import { EntitySource, EntitySourceKind } from 'booka-common';

export function entitySource(): EntitySource {
    const id = window.navigator.userAgent;
    const info = detect();
    const kind = getKind(info);
    const version = info?.version ?? undefined;
    const mobile = isMobile(info);

    return { id, kind, version, mobile };
}

function getKind(info: ReturnType<typeof detect>): EntitySourceKind {
    switch (info?.name) {
        case 'safari':
            return 'safari';
        case 'chrome':
            return 'chrome';
        case 'firefox':
            return 'firefox';
        default:
            return 'unknown';
    }
}

function isMobile(info: ReturnType<typeof detect>): boolean | undefined {
    const os = info?.os;
    if (!os) {
        return undefined;
    }
    switch (os) {
        case 'Android OS':
        case 'iOS':
        case 'Amazon OS':
        case 'Windows Mobile':
            return true;
        case 'Mac OS':
        case 'Linux':
            return false;
        default:
            if (os.startsWith('Windows')) {
                return false;
            } else {
                return undefined;
            }
    }
}
