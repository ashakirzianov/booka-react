import React, { useRef, useCallback, useEffect, ReactNode } from 'react';

import {
    Color, Path, RichTextBlock, RichTextSelection,
    RichTextFragment, RichTextSimpleFragment, RichTextImageFragment,
    RichTextListFragment, RichTextTableFragment, RichTextLineFragment,
} from './model';
import {
    fragmentLength, makePathMap, PathMap, assertNever,
} from './utils';
import {
    RefType, useScroll, computeCurrentPath, useSelection,
    pathToId, getSelectionRange, scrollToRef,
} from './web-utils';

export type RefCompType = (props: { refId: string, children: ReactNode }) => JSX.Element;
export function RichText({
    blocks, color, fontSize, fontFamily,
    pathToScroll, onScroll, onSelectionChange,
    RefComp,
}: {
    blocks: RichTextBlock[],
    color: Color,
    fontSize: number,
    fontFamily: string,
    pathToScroll?: Path,
    onScroll?: (path: Path) => void,
    onSelectionChange?: (selection: RichTextSelection | undefined) => void,
    RefComp: RefCompType,
}) {
    const refMap = useRef<PathMap<RefType>>(makePathMap());

    useScroll(useCallback(async () => {
        if (!onScroll) {
            return;
        }
        const newCurrentPath = await computeCurrentPath(refMap.current);
        if (newCurrentPath) {
            onScroll(newCurrentPath);
        }
    }, [onScroll]));

    useSelection(useCallback(() => {
        if (onSelectionChange) {
            const selection = getSelectionRange();
            onSelectionChange(selection);
        }
    }, [onSelectionChange]));

    useEffect(function scrollToCurrentPath() {
        if (pathToScroll) {
            const refToNavigate = refMap.current.get(pathToScroll);
            if (refToNavigate) {
                scrollToRef(refToNavigate);
            }
        }
    }, [pathToScroll]);

    return <span
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            color,
            fontSize,
            fontFamily,
        }}>
        {blocks.map(
            (block, idx) =>
                <RichTextBlockComp
                    key={idx}
                    path={{ block: idx }}
                    block={block}
                    refCallback={(ref, path) => {
                        refMap.current.set(path, ref);
                    }}
                    RefComp={RefComp}
                />,
        )}
    </span>;
}

type RichTextBlockProps = {
    block: RichTextBlock,
    path: Path,
    refCallback: (ref: RefType, path: Path) => void,
    RefComp: RefCompType,
};
function RichTextBlockComp({ block, refCallback, path, RefComp }: RichTextBlockProps) {
    return <div style={{
        display: 'flex',
        alignSelf: block.center
            ? 'center'
            : undefined,
        textAlign: 'justify',
        float: 'left',
        textIndent: block.indent ? '4em' : undefined,
        margin: block.margin !== undefined
            ? `${block.margin}em`
            : undefined,
    }}>
        <span
            id={pathToId(path)}
            ref={ref => refCallback(ref, path)}
        >
            {buildFragments({
                offset: 0,
                fragments: block.fragments,
                path, refCallback, RefComp,
            }).fragments}
        </span>
    </div>;
}

function buildFragments({
    fragments, path, refCallback, offset, RefComp,
}: {
    fragments: RichTextFragment[],
    offset: number,
    path: Path,
    refCallback: (ref: RefType, path: Path) => void,
    RefComp: RefCompType,
}) {
    const children: JSX.Element[] = [];
    let currentOffset = offset;
    for (let idx = 0; idx < fragments.length; idx++) {
        const frag = fragments[idx];
        children.push(<RichTextFragmentComp
            key={idx}
            path={{
                ...path,
                symbol: currentOffset,
            }}
            fragment={frag}
            refCallback={refCallback}
            RefComp={RefComp}
        />);
        currentOffset += fragmentLength(frag);
    }

    return {
        fragments: children,
        offset: currentOffset,
    };
}

type RichTextFragmentProps<F extends RichTextFragment = RichTextFragment> = {
    fragment: F,
    path: Path,
    refCallback: (ref: RefType, path: Path) => void,
    RefComp: RefCompType,
};
function RichTextFragmentComp({ fragment, ...rest }: RichTextFragmentProps) {
    switch (fragment.frag) {
        case undefined:
            return RichTextSimpleFragmentComp({ fragment, ...rest });
        case 'image':
            return RichTextImageFragmentComp({ fragment, ...rest });
        case 'list':
            return RichTextListFragmentComp({ fragment, ...rest });
        case 'table':
            return RichTextTableFragmentComp({ fragment, ...rest });
        case 'line':
            return RichTextLineFragmentComp({ fragment, ...rest });
        default:
            assertNever(fragment);
            return null;
    }
}

function RichTextSimpleFragmentComp({
    fragment: { text, attrs },
    refCallback,
    path,
    RefComp,
}: RichTextFragmentProps<RichTextSimpleFragment>) {
    attrs = attrs || {};
    const Span = <span
        id={pathToId(path)}
        ref={ref => refCallback(ref, path)}
        style={{
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
            color: attrs.color,
            background: attrs.background,
            fontSize: attrs.fontSize,
            fontFamily: attrs.fontFamily,
            fontStyle: attrs.italic ? 'italic' : undefined,
            fontWeight: attrs.bold ?
                'bold'
                : 300,
            letterSpacing: attrs.letterSpacing !== undefined
                ? `${attrs.letterSpacing}em`
                : undefined,
            ...(attrs.dropCaps && {
                float: 'left',
                fontSize: attrs.fontSize
                    ? attrs.fontSize * 4
                    : '400%',
                lineHeight: '80%',
            }),
            ...(attrs.ref && {
                cursor: 'pointer',
                textDecorationLine: 'underline',
                textDecorationStyle: 'dashed',
            }),
        }}
    >
        {text}
    </span>;
    if (attrs.ref) {
        return <RefComp refId={attrs.ref}>{Span}</RefComp>;
    } else {
        return Span;
    }
}

function RichTextImageFragmentComp({
    fragment: { src, title },
    refCallback,
    path,
}: RichTextFragmentProps<RichTextImageFragment>) {
    return <img
        src={src}
        alt={title}
        title={title}
        ref={ref => refCallback(ref, path)}
    />;
}

function RichTextListFragmentComp({
    fragment: { kind, items },
    refCallback, path, RefComp,
}: RichTextFragmentProps<RichTextListFragment>) {
    const lis: JSX.Element[] = [];
    let currentOffset = 0;
    for (let listIdx = 0; listIdx < items.length; listIdx++) {
        const item = items[listIdx];
        const { fragments, offset } = buildFragments({
            fragments: item,
            offset: currentOffset,
            refCallback, path, RefComp,
        });
        lis.push(<li key={listIdx}>
            {fragments}
        </li>);
        currentOffset = offset;
    }
    if (kind === 'ordered') {
        return <ol>
            {lis}
        </ol>;
    } else {
        return <ul>
            {lis}
        </ul>;
    }
}

function RichTextTableFragmentComp({
    fragment: { rows },
    RefComp, refCallback, path,
}: RichTextFragmentProps<RichTextTableFragment>) {
    const trs: JSX.Element[] = [];
    let currentOffset = 0;
    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
        const row = rows[rowIdx];
        const tds: JSX.Element[] = [];
        for (let cellIdx = 0; cellIdx < row.length; cellIdx++) {
            const cell = row[cellIdx];
            const { fragments, offset } = buildFragments({
                fragments: cell,
                offset: currentOffset,
                RefComp, refCallback, path,
            });
            tds.push(<td key={cellIdx}>
                {fragments}
            </td>);
            currentOffset = offset;
        }
        trs.push(<tr key={rowIdx}>
            {tds}
        </tr>);
    }
    return <table style={{
        border: '1px solid',
    }}>
        <tbody>{trs}</tbody>
    </table>;
}

function RichTextLineFragmentComp({
    fragment: { direction },
    RefComp, refCallback, path,
}: RichTextFragmentProps<RichTextLineFragment>) {
    return <hr />;
}
