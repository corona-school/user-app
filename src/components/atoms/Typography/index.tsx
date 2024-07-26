import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from 'lib/Tailwind';
import { Slot } from '@radix-ui/react-slot';

const typographyVariants = cva('text-foreground', {
    variants: {
        variant: {
            h1: 'text-4xl leading-10 font-semibold tracking-tight scroll-m-20',
            h2: 'text-3xl leading-9 font-semibold tracking-tighter scroll-m-20',
            h3: 'text-2xl leading-8 font-semibold tracking-tighter scroll-m-20',
            h4: 'text-xl leading-8 font-semibold tracking-tightest scroll-m-20',
            h5: 'text-lg leading-5 font-semibold tracking-tightest scroll-m-20',
            h6: 'text-base leading-3 font-semibold tracking-tightest scroll-m-20',
            xl: 'text-xl leading-6 font-normal tracking-normal',
            lg: 'text-lg leading-6 font-normal tracking-normal',
            body: 'text-base leading-4 font-normal tracking-normal',
            form: 'text-base leading-1 font-medium tracking-normal',
            sm: 'text-sm leading-2 font-normal tracking-normal',
            xs: 'text-xs leading-2 tracking-normal',
        },
    },
    defaultVariants: {
        variant: 'body',
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
    body: 'p',
    xs: 'p',
    sm: 'p',
    lg: 'p',
    xl: 'p',
    form: 'p',
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
