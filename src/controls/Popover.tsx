import * as React from 'react';
import { PopperProps, Manager, Reference, Popper } from 'react-popper';

import { Themed } from './theme';
import { OverlayPanel } from './Panel';
import { FadeIn } from './Animations';

export type PopoverBodyParams = {
    scheduleUpdate: () => void,
};
export function WithPopover({
    body, popoverPlacement, theme, children, open,
}: Themed & {
    children: React.ReactNode,
    body: React.ReactNode | ((params: PopoverBodyParams) => React.ReactNode),
    popoverPlacement: PopperProps['placement'],
    open?: boolean,
}) {
    const [isOpen, setIsOpen] = React.useState(open || false);

    return <Manager>
        <Reference>
            {({ ref }) =>
                <>
                    <FadeIn visible={isOpen}>
                        <div style={{
                            position: 'fixed',
                            left: 0, right: 0, top: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.1)',
                        }}
                            onClick={() => setIsOpen(false)}
                        />
                    </FadeIn>
                    <div
                        ref={ref}
                        style={{ display: 'flex' }}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {children}
                    </div>
                </>
            }
        </Reference>
        <FadeIn visible={isOpen}>
            <Popper
                placement={popoverPlacement}
                strategy='fixed'
            >
                {
                    ({ ref, style, placement, update }) =>
                        <div ref={ref} style={{
                            ...style,
                            zIndex: 100,
                        }}
                            data-placement={placement}
                        >
                            {/* TODO: add arrows */}
                            <OverlayPanel theme={theme}>
                                {
                                    typeof body === 'function'
                                        ? body({ scheduleUpdate: update })
                                        : body
                                }
                            </OverlayPanel>
                        </div>
                }
            </Popper>
        </FadeIn>
    </Manager >;
}
