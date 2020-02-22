import React from 'react';

import { Menu, Item, MenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

import { WithChildren } from '../atoms';

export function BookContextMenuConnected({ children }: WithChildren<{

}>) {
    const onClick = () => undefined;
    return <>
        <MenuProvider id='book-menu' style={{
            display: 'inline-block',
        }}>
            {children}
        </MenuProvider>
        <Menu id='book-menu'>
            <Item onClick={onClick}>Hello</Item>
        </Menu>
    </>;
}
