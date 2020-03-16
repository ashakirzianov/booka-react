import * as React from 'react';
import { range } from 'lodash';
import {
    TableOfContents, TableOfContentsItem, pathToString,
} from 'booka-common';

import {
    Row, Tab, Column, point,
    StretchTextLink, TextLine, Themed, Modal,
} from '../atoms';
import { pageForPosition } from './common';

export function TableOfContentsComp({
    theme, toc, id, closeToc,
}: Themed & {
    toc: TableOfContents,
    id: string,
    closeToc: () => void,
}) {
    const maxLevel = toc.items.reduce((max, i) => Math.max(max, i.level), 0);
    return <Modal
        theme={theme}
        title={toc.title}
        close={closeToc}
        open={true}
    >
        <Column margin={point(1)}>
            {toc.items.map(item =>
                <TocItemComp
                    theme={theme}
                    key={pathToString(item.path)}
                    id={id}
                    tabs={maxLevel - item.level}
                    item={item}
                    page={pageForPosition(item.position)}
                />
            )}
        </Column>
    </Modal>;
}

function TocItemComp({
    id, item, tabs, page, theme,
}: Themed & {
    tabs: number,
    id: string,
    item: TableOfContentsItem,
    page: number,
}) {
    return <Row>
        {range(0, tabs).map(i => <Tab key={i.toString()} />)}
        <StretchTextLink
            theme={theme}
            to={`/book/${id}?p=${item.path}`}
        >
            <TextLine
                key='title'
                theme={theme}
                text={item.title}
            />
            <TextLine
                key='pn'
                theme={theme}
                text={page.toString()}
            />
        </StretchTextLink>
    </Row>;
}
