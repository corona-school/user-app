import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/Tailwind';
import { Typography } from './Typography';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
    ({ className, ...props }, ref) => (
        <div className="max-w-full w-fit overflow-x-scroll">
            <TabsPrimitive.List
                ref={ref}
                className={cn('inline-flex h-14 items-center justify-center rounded-lg bg-accent py-4 px-3 text-primary', className)}
                {...props}
            />
        </div>
    )
);
TabsList.displayName = TabsPrimitive.List.displayName;

const Badge = ({ content }: { content: number | string }) =>
    content ? (
        <div className="flex items-center justify-center rounded-full bg-primary size-[18px] ml-2">
            <Typography variant="sm" className="text-white text-[12px]">
                {content}
            </Typography>
        </div>
    ) : null;

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
    badge?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(({ className, children, badge, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-3 text-form font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
            className
        )}
        {...props}
    >
        {children}
        {['string', 'number'].includes(typeof badge) ? <Badge content={badge as string} /> : badge}
    </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

interface TabContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
    /**
     * unmount: It's the default behavior. The TabContent is ONLY mounted when the tab is selected
     * unmount: The TabContent is always mounted but just hidden when not selected
     */
    inactiveMode?: 'hide' | 'unmount';
}

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, TabContentProps>(
    ({ className, inactiveMode = 'unmount', forceMount, ...props }, ref) => (
        <TabsPrimitive.Content
            ref={ref}
            forceMount={forceMount || inactiveMode === 'hide' ? true : undefined}
            className={cn(
                inactiveMode === 'hide' ? 'data-[state=inactive]:hidden' : '',
                'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                className
            )}
            {...props}
        />
    )
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
