import { cn } from '@/lib/Tailwind';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useCallback, useMemo } from 'react';
import { usePagination } from '@/hooks/usePagination';
import { Button } from './Button';

type Props = {
    currentIndex: number;
    totalPagesCount: number;
    onPageChange: (index: number) => void;
};

const UnsplashPagination: React.FC<Props> = ({ currentIndex, totalPagesCount, onPageChange }) => {
    const paginationRange = usePagination(totalPagesCount, currentIndex, 1);

    const onNext = useCallback(() => {
        onPageChange(currentIndex + 1);
    }, [currentIndex, onPageChange]);

    const onPrevious = useCallback(() => {
        onPageChange(currentIndex - 1);
    }, [currentIndex, onPageChange]);

    const lastPage = useMemo(() => paginationRange && paginationRange[paginationRange.length - 1], [paginationRange]);

    return (
        <div className="flex justify-center gap-2">
            {currentIndex > 1 && (
                <Button onClick={onPrevious} size="icon">
                    <IconChevronLeft />
                </Button>
            )}
            {paginationRange &&
                paginationRange.map((pageNumber) => {
                    return (
                        <Button
                            variant="ghost"
                            size="icon"
                            key={pageNumber}
                            className={cn(pageNumber === currentIndex ? 'text-primary' : 'text-primary-light')}
                            onClick={() => {
                                if (typeof pageNumber === 'number') onPageChange(pageNumber);
                            }}
                        >
                            {pageNumber}
                        </Button>
                    );
                })}
            {currentIndex !== lastPage && (
                <Button onClick={onNext} size="icon">
                    <IconChevronRight />
                </Button>
            )}
        </div>
    );
};
export default UnsplashPagination;
