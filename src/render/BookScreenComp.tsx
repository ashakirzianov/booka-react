import React from 'react';
import { BookPositionLocator } from 'booka-common';

export type BookScreenProps = {
    location: BookPositionLocator,
};
export function BookScreenComp({ location }: BookScreenProps) {
    return <div>
        {location.id}
    </div>
}
