import { cn } from '@/lib/Tailwind';
import { Root } from '@radix-ui/react-slot';
import React from 'react';

interface SkeletonProps {
    className?: string;
    loading?: boolean;
    children: React.ReactNode;
}

export const Skeleton = (props: SkeletonProps) => {
    const { children, className, loading, ...rest } = props;

    if (!loading) return <>{children}</>;

    const Tag = React.isValidElement(children) ? Root : 'span';

    return (
        <Tag
            aria-hidden
            className={cn(
                '!bg-gray-300 !text-transparent animate-pulse !opacity-1 rounded-md pointer-events-none',
                '[&::before]:!invisible [&::after]:!invisible [&>*]:!invisible',
                className
            )}
            tabIndex={-1}
            {...rest}
        >
            {children}
        </Tag>
    );
};
