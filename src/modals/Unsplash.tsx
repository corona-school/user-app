import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import SearchBar from '../components/SearchBar';
import UnsplashPagination from '../components/UnsplashPagination';
import { BaseModalProps, Modal, ModalFooter, ModalHeader, ModalTitle } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { cn } from '@/lib/Tailwind';
import { useQuery } from '@apollo/client';
import { gql } from '@/gql';

const COURSE_IMAGES_SEARCH_QUERY = gql(`
    query searchCourseImages($search: String!, $page: Float!) {
        courseImages(search: $search, page: $page, take: 8) {
            results {
                id
                description
                regularImageUrl
                smallImageUrl
            }
            total
            totalPages
        }
    }    
`);

interface UnsplashModalProps extends BaseModalProps {
    onPhotoSelected: (photoUrl: string) => void;
}

const UnsplashModal = ({ isOpen, onOpenChange, onPhotoSelected }: UnsplashModalProps) => {
    const [selectedPhoto, setSelectedPhoto] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchValue, setSearch] = useState('Schule');
    const { t } = useTranslation();
    const { data, loading: isLoading } = useQuery(COURSE_IMAGES_SEARCH_QUERY, { variables: { search: searchValue, page: pageIndex }, skip: !searchValue });

    useEffect(() => {
        if (isLoading) return;
        setTotalPages(data?.courseImages.totalPages ?? 1);
    }, [data?.courseImages.totalPages, isLoading]);

    const pickPhoto = useCallback(() => {
        onPhotoSelected(selectedPhoto);
        setSelectedPhoto('');
    }, [onPhotoSelected, selectedPhoto]);

    const photos = data?.courseImages.results || [];

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-full w-[900px] h-full flex flex-col md:h-[700px]">
            <ModalHeader>
                <ModalTitle>{t('course.unsplash.heading')}</ModalTitle>
            </ModalHeader>
            <div className="flex flex-col flex-1 gap-2 overflow-hidden">
                <div className="flex flex-col gap-2">
                    <Typography>{t('course.unsplash.description')}</Typography>
                    <div className="h-10">
                        <SearchBar
                            placeholder={t('course.unsplash.placeholder')}
                            onSearch={(value: string) => {
                                setPageIndex(1);
                                setSearch(value);
                            }}
                            autoSubmit
                        />
                    </div>
                </div>
                <div className="mt-2 md:pt-0 md:h-[400px] overflow-scroll flex-1">
                    {isLoading && <CenterLoadingSpinner />}
                    {!isLoading && (
                        <div className="flex flex-col">
                            {photos.length > 0 ? (
                                <div className="flex flex-wrap justify-center max-w-[800px] gap-2 p-2">
                                    {photos.map((photo) => {
                                        return (
                                            <div
                                                role="button"
                                                onClick={() =>
                                                    selectedPhoto === photo.regularImageUrl ? setSelectedPhoto('') : setSelectedPhoto(photo.regularImageUrl)
                                                }
                                            >
                                                <img
                                                    className={cn(
                                                        'object-cover size-[150px] md:size-[170px] rounded-sm',
                                                        selectedPhoto === photo.regularImageUrl ? 'outline outline-secondary outline-[3px]' : 'outline-none'
                                                    )}
                                                    src={photo.smallImageUrl}
                                                    alt={photo.description}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-1 justify-center items-center">
                                    <Typography>{t('course.unsplash.noSearchoResults')}</Typography>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div>
                    <UnsplashPagination
                        currentIndex={pageIndex}
                        totalPagesCount={totalPages}
                        onPageChange={(index) => {
                            setPageIndex(index);
                        }}
                    />
                </div>
            </div>
            <ModalFooter className="flex flex-col items-stretch lg:items-end">
                <Button
                    className="w-full lg:w-fit lg:min-w-[200px]"
                    disabled={!selectedPhoto}
                    reasonDisabled={t('course.unsplash.tooltipBtn')}
                    onClick={pickPhoto}
                >
                    {t('course.unsplash.choose')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
export default UnsplashModal;
