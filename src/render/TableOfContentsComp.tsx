import * as React from 'react';
import { range } from 'lodash';
import { TableOfContents, TableOfContentsItem } from 'booka-common';

import {
    Row, Tab, Column, point, StretchTextButton, TextLine, Themed, Modal, Callback,
} from '../atoms';
import { pageForPosition } from './common';

export type TableOfContentsProps = Themed & {
    toc: TableOfContents,
    id: string,
    toggleToc: Callback,
};
export function TableOfContentsComp({
    theme, toc, id, toggleToc,
}: TableOfContentsProps) {
    const maxLevel = toc.items.reduce((max, i) => Math.max(max, i.level), 0);
    return <Modal
        theme={theme}
        title={toc.title}
        toggle={toggleToc}
        open={true}
    >
        <Column margin={point(1)}>
            {toc.items.map(item =>
                <TocItemComp
                    theme={theme}
                    key={item.path.join('-')}
                    id={id}
                    tabs={maxLevel - item.level}
                    item={item}
                    page={pageForPosition(item.position)}
                />
            )}
        </Column>
    </Modal>;
}

type TocItemProps = Themed & {
    tabs: number,
    id: string,
    item: TableOfContentsItem,
    page: number,
};
function TocItemComp({ item, tabs, page, theme }: TocItemProps) {
    return <Row>
        {range(0, tabs).map(i => <Tab key={i.toString()} />)}
        <StretchTextButton
            theme={theme}
        >
            <TextLine
                key='title'
                theme={theme}
                text={item.title[0]}
            />
            <TextLine
                key='pn'
                theme={theme}
                text={page.toString()}
            />
        </StretchTextButton>
    </Row>;
}
