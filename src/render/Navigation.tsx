import React from 'react';
import { BookPath } from 'booka-common';
import { HasChildren, Link } from '../controls';
import { AppLocation } from '../ducks';
import {
    useNavigate, appLocationToUrl, useSetLibraryCard,
} from '../application';

// TODO: find better location for this file

export function BookPathLink({ bookId, path, children }: HasChildren & {
    bookId: string,
    path?: BookPath,
}) {
    return <NavigationLink to={{
        location: 'book', toc: false,
        bookId, path,
    }}>
        {children}
    </NavigationLink>;
}

export function BookRefLink({ bookId, refId, children }: HasChildren & {
    bookId: string,
    refId: string,
}) {
    return <NavigationLink to={{
        location: 'book', toc: false,
        bookId, refId,
    }}>
        {children}
    </NavigationLink>;
}

export function FeedLink({ children }: HasChildren) {
    return <NavigationLink to={{
        location: 'feed',
    }}>
        {children}
    </NavigationLink>;
}

export function CardLink({ bookId, children }: HasChildren & {
    bookId: string,
}) {
    const setCard = useSetLibraryCard();
    const url = appLocationToUrl({
        location: 'feed', card: bookId,
    });
    return <Link to={url} callback={() => setCard(bookId)}>
        {children}
    </Link>;
}

function NavigationLink({ to, children }: HasChildren & {
    to: AppLocation,
}) {
    const navigate = useNavigate();
    const url = appLocationToUrl(to);
    return <Link to={url} callback={() => navigate(to)}>
        {children}
    </Link>;
}
