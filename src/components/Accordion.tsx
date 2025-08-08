import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@/lib/Tailwind';
import { Icon, IconChevronDown, IconProps } from '@tabler/icons-react';

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
    return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
    return <AccordionPrimitive.Item data-slot="accordion-item" className={cn('border-b last:border-b-0', className)} {...props} />;
}

function AccordionTrigger({
    className,
    IconComponent = IconChevronDown,
    iconClasses,
    children,
    ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
    IconComponent?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
    iconClasses?: string;
}) {
    return (
        <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
                data-slot="accordion-trigger"
                className={cn(
                    'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
                    className
                )}
                {...props}
            >
                {children}
                <IconComponent
                    className={cn('text-muted-foreground pointer-events-none size-6 shrink-0 translate-y-0.5 transition-transform duration-200', iconClasses)}
                />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
    return (
        <AccordionPrimitive.Content
            data-slot="accordion-content"
            className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
            {...props}
        >
            <div className={cn('pt-0 pb-4', className)}>{children}</div>
        </AccordionPrimitive.Content>
    );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
