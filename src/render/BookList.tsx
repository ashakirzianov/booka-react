import { BookDesc } from 'booka-common';
import { Column, TextLink } from '../atoms';
import { useTheme } from '../core';

export type BookListProps = {
    books: BookDesc[],
};
export function BookListComp({ books }: BookListProps) {
    return <Column>
        {
            books.map((desc, idx) =>
                <BookItemComp key={idx} desc={desc} />
            )
        }
    </Column>;
}

type BookItemProps = {
    desc: BookDesc,
};
function BookItemComp({ desc }: BookItemProps) {
    const theme = useTheme();
    return <Column>
        <TextLink
            theme={theme}
            text={desc.title}
            to={`/book/${desc.id}`}
        />
    </Column>;
}
