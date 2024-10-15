import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/Tailwind';
import { IconChevronRight, IconDots, IconSlash } from '@tabler/icons-react';
import { Typography } from './Typography';
import { useTranslation } from 'react-i18next';

const BreadcrumbContainer = React.forwardRef<
    HTMLElement,
    React.ComponentPropsWithoutRef<'nav'> & {
        separator?: React.ReactNode;
    }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<'ol'>>(({ className, ...props }, ref) => (
    <ol
        ref={ref}
        className={cn('flex flex-nowrap overflow-hidden items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5', className)}
        {...props}
    />
));

const BreadcrumbPath = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
));

const BreadcrumbLink = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<typeof Link> & {
        asChild?: boolean;
    }
>(({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : Link;

    return <Comp ref={ref} className={cn('text-detail underline transition-colors hover:text-primary line-clamp-1', className)} {...props} />;
});

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(({ className, ...props }, ref) => (
    <Typography
        as="span"
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cn('font-normal text-primary text-detail line-clamp-1', className)}
        {...props}
    />
));

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<'li'>) => (
    <li role="presentation" aria-hidden="true" className={cn('[&>svg]:size-3.5', className)} {...props}>
        {children ?? <IconChevronRight />}
    </li>
);

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
    <span role="presentation" aria-hidden="true" className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
        <IconDots className="h-4 w-4" />
        <span className="sr-only">More</span>
    </span>
);

export interface BreadcrumbItem {
    route?: string;
    label: string;
}

interface BreadcrumbProps {
    className?: string;
    includeHome?: boolean;
    items: BreadcrumbItem[];
}

export const Breadcrumb = ({ className, includeHome = true, items = [] }: BreadcrumbProps) => {
    const { t } = useTranslation();
    return (
        <BreadcrumbContainer className={className}>
            <BreadcrumbList>
                {includeHome && (
                    <>
                        <BreadcrumbPath>
                            <BreadcrumbLink to="/start">{t('navigation.label.start')}</BreadcrumbLink>
                        </BreadcrumbPath>
                        <BreadcrumbSeparator>
                            <IconSlash />
                        </BreadcrumbSeparator>
                    </>
                )}
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <>
                            {isLast ? (
                                <BreadcrumbPath>
                                    <BreadcrumbPage className="max-w-80">{item.label}</BreadcrumbPage>
                                </BreadcrumbPath>
                            ) : (
                                <BreadcrumbPath>
                                    <BreadcrumbLink to={item.route || ''}>{item.label}</BreadcrumbLink>
                                </BreadcrumbPath>
                            )}
                            {!isLast && (
                                <BreadcrumbSeparator>
                                    <IconSlash />
                                </BreadcrumbSeparator>
                            )}
                        </>
                    );
                })}
            </BreadcrumbList>
        </BreadcrumbContainer>
    );
};

export { BreadcrumbContainer, BreadcrumbList, BreadcrumbPath, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis };
