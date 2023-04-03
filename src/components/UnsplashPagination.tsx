import { HStack, Button, ChevronLeftIcon, ChevronRightIcon } from 'native-base';
import { useCallback, useMemo } from 'react';
import { usePagination } from '../hooks/usePagination';

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
        <HStack justifyContent={'center'}>
            {currentIndex > 1 && (
                <Button onPress={onPrevious}>
                    <ChevronLeftIcon />
                </Button>
            )}
            {paginationRange &&
                paginationRange.map((pageNumber) => {
                    return (
                        <Button
                            variant="ghost"
                            _text={{ color: pageNumber === currentIndex ? 'primary.900' : 'primary.500' }}
                            onPress={() => {
                                if (typeof pageNumber === 'number') onPageChange(pageNumber);
                            }}
                        >
                            {pageNumber}
                        </Button>
                    );
                })}
            {currentIndex !== lastPage && (
                <Button onPress={onNext}>
                    <ChevronRightIcon />
                </Button>
            )}
        </HStack>
    );
};
export default UnsplashPagination;
