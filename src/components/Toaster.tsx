import { createPortal } from 'react-dom';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    return createPortal(
        <Sonner
            richColors
            className="toaster group pointer-events-auto"
            theme="light"
            visibleToasts={4}
            toastOptions={{
                closeButton: true,
                duration: 5000,
                classNames: {
                    toast: 'toast text-base',
                    description: 'group-[.toast]:!text-detail',
                    closeButton: 'left-auto right-[-10px] group-[.toast-info]:!bg-white group-[.toast-info]:!text-primary',
                    actionButton: 'group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground',
                    cancelButton: 'group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground',
                    error: 'group toast-error group-[.toaster]:!bg-red group-[.toaster]:!text-red-600 group-[.toaster]:shadow-lg',
                    success: 'group toast-success group-[.toaster]:!bg-green group-[.toaster]:!text-green-600 group-[.toaster]:shadow-lg',
                    warning: 'group toast-warning group-[.toaster]:!bg-yellow group-[.toaster]:!text-yellow-600 group-[.toaster]:shadow-lg',
                    info: 'group toast-info group-[.toaster]:!bg-white group-[.toaster]:!text-primary group-[.toaster]:shadow-lg group-[.toaster]:shadow-lg',
                },
            }}
            {...props}
        />,
        document.body
    );
};

export { Toaster };
