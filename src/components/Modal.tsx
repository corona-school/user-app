import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { IconX } from '@tabler/icons-react';
import { cn } from '@/lib/Tailwind';

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
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ModalContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(
    ({ className, children, ...props }, ref) => (
        <ModalPortal>
            <ModalOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg fill-mode-forwards',
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
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <IconX className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </ModalPortal>
    )
);
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
ModalHeader.displayName = 'ModalHeader';

const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-row lg:justify-end gap-x-2', className)} {...props} />
);
ModalFooter.displayName = 'ModalFooter';

const ModalTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
    ({ className, ...props }, ref) => (
        <DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
    )
);
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />);
ModalDescription.displayName = DialogPrimitive.Description.displayName;

export interface BaseModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

interface InternalModalProps extends BaseModalProps {
    children: React.ReactNode;
}

export const Modal = ({ isOpen, children, onOpenChange }: InternalModalProps) => {
    return (
        <Dialog open={!!isOpen} modal onOpenChange={onOpenChange}>
            <ModalContent>{children}</ModalContent>
        </Dialog>
    );
};

export { Dialog, ModalPortal, ModalOverlay, ModalTrigger, ModalClose, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription };
