import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from 'lib/Tailwind';
import { Slot } from '@radix-ui/react-slot';

const typographyVariants = cva('text-foreground', {
    variants: {
        variant: {
            h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary',
            h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-primary',
            h3: 'scroll-m-20 text-2xl font-semibold tracking-tight text-primary',
            h4: 'scroll-m-20 text-xl font-semibold tracking-tight text-primary',
            h5: 'scroll-m-20 text-lg font-semibold tracking-tight text-primary',
            h6: 'scroll-m-20 text-base font-semibold tracking-tight text-primary',
            p: 'leading-7',
            blockquote: 'border-l-2 pl-6 italic',
            ul: 'my-6 ml-6 list-disc [&>li]:mt-2',
            inlineCode: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
            lead: 'text-xl text-muted-foreground',
            largeText: 'text-lg font-semibold',
            smallText: 'text-sm font-medium leading-none',
            mutedText: 'text-sm text-muted-foreground',
        },
    },
    defaultVariants: {
        variant: 'p',
    },
});

type VariantPropType = VariantProps<typeof typographyVariants>;

const variantElementMap: Record<NonNullable<VariantPropType['variant']>, string> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    p: 'p',
    blockquote: 'blockquote',
    inlineCode: 'code',
    largeText: 'div',
    smallText: 'small',
    lead: 'p',
    mutedText: 'p',
    ul: 'ul',
};

export interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
    asChild?: boolean;
    as?: string;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(({ className, variant, as: asProp, asChild, ...props }, ref) => {
    const Comp = React.useMemo(() => {
        if (asChild) return Slot;
        if (asProp) return asProp;
        if (variant) return variantElementMap[variant];
        return 'p';
    }, [asChild, asProp, variant]);
    return <Comp className={cn(typographyVariants({ variant, className }))} ref={ref} {...props} />;
});

Typography.displayName = 'Typography';

export { Typography, typographyVariants };
