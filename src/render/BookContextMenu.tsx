import React from 'react';

import { Highlight, BookRange, HighlightGroup } from 'booka-common';
import { BookSelection } from '../reader';
import { useHighlights, useTheme } from '../application';
import { ContextMenu, ContextMenuItem, HasChildren, TextContextMenuItem, View, CircleButton, colorForHighlightGroup, normalMargin } from '../controls';
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
export type ContextMenuTarget =
    | HighlightTarget
    | SelectionTarget
    | EmptyTarget
    ;

export function BookContextMenu({
    children, target, bookId,
}: HasChildren & {
    bookId: string
    target: ContextMenuTarget,
}) {
    const { theme } = useTheme();
    const {
        addHighlight, removeHighlight, updateHighlightGroup,
    } = useHighlights(bookId);

    if (target.target === 'empty') {
        return <>{children}</>;
    }
    return <ContextMenu
        theme={theme}
        id='book-menu'
        trigger={children}
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
        onClick={() => addHighlight(bookId, target.selection.range, 'first')}
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
        <View style={{
            flexDirection: 'row',
            margin: normalMargin,
        }}>
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
        </View>
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
        text={selected ? 'A' : undefined}
        color='white'
        background={colorForHighlightGroup(group)}
        highlight='white'
        border={selected ? 'white' : undefined}
        fontSize='micro'
        size={30}
        onClick={() => setHighlightGroup(target.highlight.uuid, group)}
    />;
}

function RemoveHighlightItem({
    target, removeHighlight, theme,
}: Themed & {
    target: ContextMenuTarget,
    removeHighlight: (highlightId: string) => void,
}) {
    if (target.target !== 'highlight') {
        return null;
    }

    return <ContextMenuItem
        theme={theme}
        onClick={() => removeHighlight(target.highlight.uuid)}
    >
        Remove highlight
    </ContextMenuItem>;
}

function SetHighlightGroupItem({
    target, group, setHighlightGroup, theme,
}: Themed & {
    target: ContextMenuTarget,
    group: string,
    setHighlightGroup: (id: string, group: string) => void,
}) {
    if (target.target !== 'highlight' || target.highlight.group === group) {
        return null;
    }

    return <ContextMenuItem
        theme={theme}
        onClick={() => setHighlightGroup(target.highlight.uuid, group)}
    >
        Make highlight {group}
    </ContextMenuItem>;
}
