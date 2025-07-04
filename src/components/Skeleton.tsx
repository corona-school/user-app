import { cn } from '@/lib/Tailwind';
import { Root } from '@radix-ui/react-slot';
import React from 'react';

interface SkeletonProps {
    className?: string;
    isLoading?: boolean;
    children: React.ReactNode;
    variant?: 'none' | 'body';
}

export const Skeleton = (props: SkeletonProps) => {
    const { children, className, isLoading, variant, ...rest } = props;

    if (!isLoading) return <>{children}</>;

    const Tag = React.isValidElement(children) ? Root : 'span';

    return (
        <Tag
            aria-hidden
            className={cn(
                '!bg-gray-300 !text-transparent animate-pulse !opacity-1 rounded-md pointer-events-none',
                '[&::before]:!invisible [&::after]:!invisible [&>*]:!invisible',
                {
                    'h-6 max-w-[500px] w-full': variant === 'body',
                },
                className
            )}
            tabIndex={-1}
            {...rest}
        >
            {children}
        </Tag>
    );
};
