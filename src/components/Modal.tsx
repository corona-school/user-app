import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconX } from '@tabler/icons-react';
import { cn } from '@/lib/Tailwind';
import { cva, VariantProps } from 'class-variance-authority';

const Dialog = DialogPrimitive.Root;

const ModalTrigger = DialogPrimitive.Trigger;

const ModalPortal = DialogPrimitive.Portal;

const ModalClose = DialogPrimitive.Close;

const ModalOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
    ({ className, ...props }, ref) => (
        <DialogPrimitive.Overlay
            ref={ref}
            className={cn(
                'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fill-mode-forwards',
                className
            )}
            {...props}
        />
    )
);
interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
    classes?: {
        closeIcon?: string;
    };
}

const ModalContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, ModalContentProps>(
    ({ className, classes, children, ...props }, ref) => (
        <ModalPortal>
            <ModalOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 pt-[52px] shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg fill-mode-forwards',
                    className
                )}
                {...props}
                onInteractOutside={(e) => {
                    const { originalEvent } = e.detail;
                    if (originalEvent.target instanceof Element && originalEvent.target.closest('.group.toast')) {
                        e.preventDefault();
                    }
                }}
            >
                {children}
                <DialogPrimitive.Close
                    className={cn(
                        'absolute right-6 top-6 rounded-sm ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
                        classes?.closeIcon
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    <IconX className="h-7 w-7" />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </ModalPortal>
    )
);

const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-1.5 text-left', className)} {...props} />
);

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive';
}

const ModalFooter = ({ className, variant = 'default', ...props }: ModalFooterProps) => (
    <div className={cn('flex gap-x-2', variant === 'default' ? 'flex-row md:justify-end' : 'flex-row-reverse lg:justify-start', className)} {...props} />
);

const ModalTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
    ({ className, ...props }, ref) => (
        <DialogPrimitive.Title ref={ref} className={cn('text-xl font-semibold leading-none tracking-tight', className)} {...props} />
    )
);

const ModalDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} {...props} />);

export interface BaseModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const modalVariants = cva('w-full max-w-[calc(100vw-2rem)] md:max-w-lg', {
    variants: {
        size: {
            unset: '',
            sm: 'md:max-w-[560px]',
            md: 'md:max-w-[656px]',
            lg: 'md:max-w-[752px]',
        },
    },
    defaultVariants: {
        size: 'unset',
    },
});

interface InternalModalProps extends BaseModalProps, VariantProps<typeof modalVariants> {
    children: React.ReactNode;
    className?: string;
    classes?: ModalContentProps['classes'];
}

export const Modal = React.forwardRef<HTMLDivElement, InternalModalProps>(({ isOpen, children, className, classes, onOpenChange, size }, ref) => {
    return (
        <Dialog open={!!isOpen} modal onOpenChange={onOpenChange}>
            <ModalContent ref={ref} className={cn(modalVariants({ size }), className)} classes={classes} aria-describedby={undefined}>
                {children}
            </ModalContent>
        </Dialog>
    );
});

export { Dialog, ModalPortal, ModalOverlay, ModalTrigger, ModalClose, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription };
