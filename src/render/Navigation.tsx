import React from 'react';
import { BookPath } from 'booka-common';
import { HasChildren, Link } from '../controls';
import { AppLocation } from '../ducks';
import { useNavigate, appLocationToUrl } from '../application';

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

function NavigationLink({ to, children }: HasChildren & {
    to: AppLocation,
}) {
    const navigate = useNavigate();
    const url = appLocationToUrl(to);
    return <Link to={url} callback={() => navigate(to)}>
        {children}
    </Link>;
}
