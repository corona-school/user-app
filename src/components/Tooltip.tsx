import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/Tailwind';
import { IconInfoCircleFilled } from '@tabler/icons-react';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>>(
    ({ className, sideOffset = 4, ...props }, ref) => (
        <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                className
            )}
            {...props}
        />
    )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

interface TooltipButtonProps {
    tooltipContent: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

/**
 * Headless button that shows a tooltip onHover and onClick (ideal for mobile devices)
 * For more granularity in usage, please use the composable pieces.
 */
export const TooltipButton = ({ children, tooltipContent, className }: TooltipButtonProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <TooltipProvider>
            <Tooltip open={isOpen} onOpenChange={setIsOpen}>
                <TooltipTrigger onClick={() => setIsOpen(true)}>{children}</TooltipTrigger>
                <TooltipContent className={className}>{tooltipContent}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export const InfoTooltipButton: React.FC<{ tooltipContent: string }> = ({ tooltipContent }) => {
    return (
        <TooltipButton tooltipContent={tooltipContent} className="max-w-[min(600px,80vw)]">
            <IconInfoCircleFilled size="20px" />
        </TooltipButton>
    );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
