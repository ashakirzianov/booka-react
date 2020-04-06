import { CurrentPosition } from 'booka-common';

export function mostRecentPosition(positions: CurrentPosition[]): CurrentPosition | undefined {
    return positions.length === 0
        ? undefined
        : positions.reduce(
            (most, curr) => most.created < curr.created ? curr : most,
        );
}
