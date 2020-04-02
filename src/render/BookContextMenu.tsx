import React, { useState, useCallback, MutableRefObject } from 'react';

import { Highlight, BookRange, HighlightGroup, doesRangeOverlap } from 'booka-common';
import { BookSelection } from '../reader';
import { useTheme, useHighlightsActions, useHighlights } from '../application';
import {
    ContextMenu, ContextMenuItem, TextContextMenuItem,
    CircleButton, colorForHighlightGroup, SimpleButton,
    Icon, HasChildren,
} from '../controls';
import { Themed } from '../core';

type HighlightTarget = {
    target: 'highlight',
    highlight: Highlight,
};
type SelectionTarget = {
    target: 'selection',
    selection: BookSelection,
};
type EmptyTarget = {
    target: 'empty',
};
type ContextMenuTarget =
    | HighlightTarget
    | SelectionTarget
    | EmptyTarget
    ;

export type SelectionType = MutableRefObject<BookSelection | undefined>;
export function BookContextMenu({
    bookId, children, selection,
}: HasChildren & {
    bookId: string
    selection: SelectionType,
}) {
    const { theme } = useTheme();
    const {
        addHighlight, removeHighlight, updateHighlightGroup,
    } = useHighlightsActions();
    const { onTrigger, target } = useMenuTarget(bookId, selection);

    return <ContextMenu
        id='book-menu'
        theme={theme}
        trigger={children}
        onTrigger={onTrigger}
    >
        <AddHighlightItem
            theme={theme}
            target={target}
            bookId={bookId}
            addHighlight={addHighlight}
        />
        <ManageHighlightItem
            theme={theme}
            target={target}
            setHighlightGroup={updateHighlightGroup}
            removeHighlight={removeHighlight}
        />
    </ContextMenu>;
}

function useMenuTarget(bookId: string, selection: SelectionType) {
    const highlights = useHighlights(bookId);
    const [target, setTarget] = useState<ContextMenuTarget>({ target: 'empty' });
    const onTrigger = useCallback(() => {
        const current = selection.current;
        if (current !== undefined) {
            const selectedHighlight = highlights
                .find(h => doesRangeOverlap(h.range, current.range));
            const newTarget: ContextMenuTarget = selectedHighlight
                ? { target: 'highlight', highlight: selectedHighlight }
                : { target: 'selection', selection: current };
            setTarget(newTarget);
            return true;
        } else {
            setTarget({ target: 'empty' });
            return false;
        }
    }, [highlights, selection]);

    return { onTrigger, target };
}

function AddHighlightItem({
    target, bookId, addHighlight, theme,
}: Themed & {
    target: ContextMenuTarget,
    bookId: string,
    addHighlight: (bookId: string, range: BookRange, group: HighlightGroup) => void,
}) {
    if (target.target !== 'selection') {
        return null;
    }

    return <TextContextMenuItem
        theme={theme}
        text='Add Highlight'
        icon='highlight'
        callback={() => addHighlight(bookId, target.selection.range, 'first')}
    />;
}

function ManageHighlightItem({
    theme, target, setHighlightGroup, removeHighlight,
}: Themed & {
    target: ContextMenuTarget,
    setHighlightGroup: (id: string, group: string) => void,
    removeHighlight: (highlightId: string) => void,
}) {
    if (target.target !== 'highlight') {
        return null;
    }

    return <ContextMenuItem
        theme={theme}
    >
        <SetHighlightGroupButton
            theme={theme}
            target={target}
            group='first'
            setHighlightGroup={setHighlightGroup}
        />
        <SetHighlightGroupButton
            theme={theme}
            target={target}
            group='second'
            setHighlightGroup={setHighlightGroup}
        />
        <SetHighlightGroupButton
            theme={theme}
            target={target}
            group='third'
            setHighlightGroup={setHighlightGroup}
        />
        <RemoveHighlightButton
            theme={theme}
            removeHighlight={() => removeHighlight(target.highlight.uuid)}
        />
    </ContextMenuItem>;
}

function SetHighlightGroupButton({
    theme, target, group, setHighlightGroup,
}: Themed & {
    target: HighlightTarget,
    group: HighlightGroup,
    setHighlightGroup: (id: string, group: string) => void,
}) {
    const selected = target.highlight.group === group;
    return <CircleButton
        theme={theme}
        // text={selected ? 'A' : undefined}
        color='white'
        background={colorForHighlightGroup(group)}
        highlight='white'
        border={selected ? 'white' : undefined}
        fontSize='xsmall'
        size={30}
        callback={() => setHighlightGroup(target.highlight.uuid, group)}
    />;
}

function RemoveHighlightButton({ theme, removeHighlight }: Themed & {
    removeHighlight: () => void,
}) {
    return <SimpleButton callback={removeHighlight}>
        <Icon
            theme={theme}
            size={30}
            name='remove'
            color='text'
            hoverColor='highlight'
        />
    </SimpleButton>;
}
