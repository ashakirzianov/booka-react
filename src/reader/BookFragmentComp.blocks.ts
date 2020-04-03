import {
    BookFragment, BookPath, BookNode, assertNever, flatten,
    ParagraphNode, ListNode, TableNode, Span,
    AttributeName, pathLessThan, iterateBookFragment,
    BookRange, TitleNode, ImageDic, Image, isSimpleSpan,
    pathWithSpan, sameNode, BookNodePath,
} from 'booka-common';
import {
    RichTextBlock, AttrsRange, applyAttrsRange, RichTextFragment,
    RichTextAttrs, Color, Path,
} from './RichText';

export type ColorizedRange = {
    color: Color,
    range: BookRange,
};
type BuildBlocksDataArgs = {
    fragment: BookFragment,
    colorization: ColorizedRange[] | undefined,
    fontSize: number,
    refColor: Color,
    refHoverColor: Color,
};

type BlockWithPath = {
    block: RichTextBlock,
    path: BookPath,
};
type BlockData = BlockWithPath[];
export function buildBlocksData(args: BuildBlocksDataArgs) {
    return Array.from(generateBlocks(args));
}

export function bookPathForBlockPath(blockPath: Path, data: BlockData): BookPath | undefined {
    // TODO: investigate this bug further: why we need '?' here?
    const prefix = data[blockPath.block]?.path;
    const bookPath = prefix !== undefined && blockPath.symbol !== undefined
        ? pathWithSpan(prefix, blockPath.symbol)
        : prefix;
    return bookPath;
}
export function blockPathForBookPath(path: BookPath, data: BlockData): Path | undefined {
    const blockIndex = data
        .findIndex(datum => sameNode(datum.path, path));
    if (blockIndex >= 0) {
        return {
            block: blockIndex,
            symbol: path.span,
        };
    } else {
        return undefined;
    }
}

function* generateBlocks({
    fragment, colorization,
    fontSize, refColor, refHoverColor,
}: BuildBlocksDataArgs): Generator<BlockWithPath> {
    let isUnderTitle = false;
    for (const [node, path] of iterateBookFragment(fragment)) {
        const block = blockForNode(node, {
            isUnderTitle, fontSize, refColor, refHoverColor,
            images: fragment.images || {},
        });
        if (block === undefined) {
            continue;
        }
        if (colorization) {
            block.fragments = colorizeFragments(block.fragments, colorization, path);
        }
        yield { block, path };
        isUnderTitle = node.node === 'title';
    }
}

type BuildBlocksEnv = {
    isUnderTitle: boolean,
    fontSize: number,
    refColor: Color,
    refHoverColor: Color,
    images: ImageDic,
};

function blockForNode(node: BookNode, env: BuildBlocksEnv): RichTextBlock | undefined {
    switch (node.node) {
        case undefined:
        case 'pph':
            return blockForParagraph(node, env);
        case 'title':
            return blockForTitle(node, env);
        case 'list':
            return blockForList(node, env);
        case 'table':
            return blockForTable(node, env);
        case 'separator':
            return {
                fragments: [{
                    frag: 'line', direction: 'horizontal',
                }],
            };
        case 'image':
            return { fragments: fragmentsForImage(node.image, env) };
        case 'ignore':
            return { fragments: [] };
        default:
            assertNever(node);
            return undefined;
    }
}

function blockForParagraph(node: ParagraphNode, env: BuildBlocksEnv): RichTextBlock {
    let fragments = fragmentsForSpan(node.span, env);

    const isFirstParagraph = env.isUnderTitle;
    const needDropCase = isFirstParagraph;
    if (needDropCase) {
        const dropCaps: AttrsRange = {
            attrs: { dropCaps: true },
            start: 0,
            end: 1,
        };
        fragments = applyAttrsRange(fragments, dropCaps);
    }
    return {
        indent: !needDropCase,
        fragments,
    };
}

function blockForTitle({ span, level }: TitleNode, env: BuildBlocksEnv): RichTextBlock {
    const attrs: RichTextAttrs = {
        letterSpacing: level === 0
            ? 0.15
            : undefined,
        italic: level < 0,
        fontSize: level > 0
            ? env.fontSize * 1.5
            : env.fontSize,
    };
    let fragments = fragmentsForSpan(span, env);
    fragments = applyAttrsRange(fragments, {
        start: 0,
        attrs,
    });

    return {
        margin: level > 0
            ? 1
            : 0.8,
        center: level >= 0,
        fragments,
    };
}

function blockForList(node: ListNode, env: BuildBlocksEnv): RichTextBlock {
    const items = node.items.map(i =>
        fragmentsForSpan(i.span, env),
    );
    const fragments: RichTextFragment[] = [{
        frag: 'list',
        kind: node.kind === 'basic'
            ? 'unordered'
            : 'ordered',
        items,
    }];
    return { fragments };
}

function blockForTable(node: TableNode, env: BuildBlocksEnv): RichTextBlock {
    const rows = node.rows.map(row => {
        return (row.cells
            .map(cell => fragmentsForSpan(cell.span, env))
        );
    });
    const fragments: RichTextFragment[] = [{
        frag: 'table',
        rows,
    }];
    return { fragments };
}

function fragmentsForSpan(span: Span, env: BuildBlocksEnv): RichTextFragment[] {
    switch (span.span) {
        case 'ref': {
            const inside = fragmentsForSpan(span.content, env);
            const range: AttrsRange = span.refToId
                ? {
                    attrs: {
                        ref: span.refToId,
                        color: env.refColor,
                    },
                    start: 0,
                }
                : { attrs: {}, start: 0 };
            const result = applyAttrsRange(inside, range);
            return result;
        }
        case 'bold': case 'italic': case 'big': case 'small':
        case 'sub': case 'sup': case 'quote': {
            const inside = fragmentsForSpan(span.content, env);
            const range: AttrsRange = {
                attrs: convertAttr(span.span),
                start: 0,
            };
            const result = applyAttrsRange(inside, range);
            return result;
        }
        case 'ruby': case 'plain': {
            return fragmentsForSpan(span.content, env);
        }
        case 'image':
            return fragmentsForImage(span.image, env);
        case undefined:
            if (isSimpleSpan(span)) {
                return [{ text: span }];
            } else {
                const ss = span;
                return flatten(ss.map(s => fragmentsForSpan(s, env)));
            }
        default:
            assertNever(span);
            return [];
    }
}

function fragmentsForImage(image: Image, env: BuildBlocksEnv): RichTextFragment[] {
    if (image.image === 'ref') {
        const resolved = env.images[image.imageId];
        image = resolved !== undefined
            ? resolved
            : image;
    }
    switch (image.image) {
        case 'external':
            return [{
                frag: 'image',
                src: image.url,
                title: image.title,
            }];
        case 'buffer':
            return [{
                frag: 'image',
                src: imageSrcFromBase64(image.base64),
                title: image.title,
            }];
        case 'ref':
        default:
            return [];
    }
}

function convertAttr(an: AttributeName): RichTextAttrs {
    switch (an) {
        case 'italic':
            return { italic: true };
        case 'bold':
            return { bold: true };
        default:
            // TODO: support all
            // TODO: assert never
            return {};
    }
}

function colorizeFragments(
    fragments: RichTextFragment[],
    colorization: ColorizedRange[],
    path: BookNodePath,
): RichTextFragment[] {
    for (const col of colorization) {
        const relative = colorizedRangeRelativeToPath(path, col);
        if (relative) {
            fragments = applyAttrsRange(fragments, relative);
        }
    }

    return fragments;
}

function colorizedRangeRelativeToPath(path: BookNodePath, colorized: ColorizedRange): AttrsRange | undefined {
    if (colorized.range.end && pathLessThan(colorized.range.end, path)) {
        return undefined;
    }

    let start: number | undefined;
    if (!pathLessThan(path, colorized.range.start)) {
        start = 0;
    } else if (sameNode(path, colorized.range.start)) {
        start = colorized.range.start.span || 0;
    }
    let end: number | undefined;
    if (colorized.range.end && sameNode(path, colorized.range.end)) {
        end = colorized.range.end.span;
    }

    const attrs: RichTextAttrs = {
        background: colorized.color,
    };

    return start !== undefined
        ? { start, end, attrs }
        : undefined;
}

function imageSrcFromBase64(base64: string): string {
    const buffer = Buffer.from(base64, 'base64');
    const arrayBufferView = new Uint8Array(buffer);
    const blob = new Blob([arrayBufferView], { type: 'image/jpg' });
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);
    return imageUrl;
}
