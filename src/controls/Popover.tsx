import * as React from 'react';
import { PopperProps, Manager, Reference, Popper } from 'react-popper';

import { Themed } from '../application';
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
    let isInBody = false;

    return <Manager>
        <Reference>
            {({ ref }) =>
                <>
                    <div
                        ref={ref}
                        style={{ display: 'flex' }}
                        onMouseEnter={() => {
                            setIsOpen(true);
                        }}
                        onMouseLeave={() => {
                            setTimeout(() => {
                                if (!isInBody) {
                                    setIsOpen(false);
                                }
                            });
                        }}
                    >
                        {children}
                    </div>
                </>
            }
        </Reference>
        <FadeIn visible={isOpen}>
            <Popper
                placement={popoverPlacement}
                positionFixed={true}
            >
                {
                    ({ ref, style, placement, scheduleUpdate }) =>
                        <div ref={ref} style={{
                            ...style,
                            zIndex: 100,
                        }}
                            data-placement={placement}
                            onMouseOver={() => {
                                isInBody = true;
                            }}
                            onMouseLeave={() => {
                                isInBody = false;
                                setIsOpen(false);
                            }}
                        >
                            {/* TODO: add arrows */}
                            <OverlayPanel theme={theme}>
                                {
                                    typeof body === 'function'
                                        ? body({ scheduleUpdate })
                                        : body
                                }
                            </OverlayPanel>
                        </div>
                }
            </Popper>
        </FadeIn>
    </Manager >;
}
