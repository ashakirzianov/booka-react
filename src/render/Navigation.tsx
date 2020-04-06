import React from 'react';
import { BookPath } from 'booka-common';
import { HasChildren } from '../controls';
import { AppLocation } from '../ducks';
import { linkToUrl } from '../application';

export function BookPathLink({ bookId, path, children }: HasChildren & {
    bookId: string,
    path?: BookPath,
}) {
    return <Link link={{
        location: 'book', toc: false,
        bookId, path,
    }}>
        {children}
    </Link>;
}

export function BookRefLink({ bookId, refId, children }: HasChildren & {
    bookId: string,
    refId: string,
}) {
    return <Link link={{
        location: 'book', toc: false,
        bookId, refId,
    }}>
        {children}
    </Link>;
}

export function FeedLink({ children }: HasChildren) {
    return <Link link={{
        location: 'feed',
    }}>
        {children}
    </Link>;
}

function Link({ link, children }: HasChildren & {
    link: AppLocation,
}) {
    const href = linkToUrl(link);
    return <a style={{
        textDecoration: 'none',
        minHeight: 0,
        margin: 0,
    }}
        href={href}
    >
        {children}
    </a>;
}
