import { Slot } from '@radix-ui/react-slot';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { useIsOverflow } from '../hooks/useIsOverflow';
import { cn } from '../lib/Tailwind';

interface TruncatedTextProps {
    children: React.ReactNode;
    asChild?: boolean;
    maxLines: 1 | 2 | 3 | 4;
    buttonClasses?: string;
}

// So tailwind knows that we're using this classes and should not be removed from the css output
const classes = {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
    6: 'line-clamp-6',
};

const TruncatedText = ({ children, asChild, maxLines, buttonClasses }: TruncatedTextProps) => {
    const { t } = useTranslation();
    const ref = useRef<HTMLElement>(null);
    const [showMore, setShowMore] = useState(true);
    const SlotContent = asChild ? Slot : 'span';
    const showControls = useIsOverflow(ref);

    const handleOnShowMore = () => {
        setShowMore(false);
    };

    const handleOnShowLess = () => {
        setShowMore(true);
    };

    return (
        <>
            <SlotContent ref={ref} className={cn(!showMore ? '' : classes[maxLines], 'text-balance')}>
                {children}
            </SlotContent>
            {showControls && showMore && (
                <Button className={cn('inline-flex p-0 underline font-bold', buttonClasses)} size="auto" variant="none" onClick={handleOnShowMore}>
                    {t('showMore')}
                </Button>
            )}
            {showControls && !showMore && (
                <Button className={cn('inline-flex p-0 underline font-bold', buttonClasses)} size="auto" variant="none" onClick={handleOnShowLess}>
                    {t('showLess')}
                </Button>
            )}
        </>
    );
};

export default TruncatedText;
