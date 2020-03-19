import * as React from 'react';
import { PopperProps, Manager, Reference, Popper } from 'react-popper';

import { Theme, platformValue } from '../application';
import { FadeIn } from './Animations';

type PopoverBodyParams = {
    scheduleUpdate: () => void,
};
export function WithPopover({
    body, popoverPlacement, theme, children, open,
}: {
    theme: Theme,
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
                positionFixed={platformValue({
                    firefox: true,
                    default: false,
                })}
            >
                {
                    ({ ref, style, placement, scheduleUpdate }) =>
                        <div ref={ref} style={{
                            ...style,
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
                            {
                                typeof body === 'function'
                                    ? body({ scheduleUpdate })
                                    : body
                            }
                        </div>
                }
            </Popper>
        </FadeIn>
    </Manager >;
}
