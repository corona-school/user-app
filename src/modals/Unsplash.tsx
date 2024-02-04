import { HStack, Pressable, View, Text, VStack, Image, Box, Flex, useTheme, Row, Modal, Stack, useBreakpointValue } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import SearchBar from '../components/SearchBar';
import UnsplashPagination from '../components/UnsplashPagination';
import DisableableButton from '../components/DisablebleButton';

type Props = {
    showUnsplashModal: boolean;
    onPhotoSelected: (photoUrl: string) => void;
    onClose: () => void;
};

const Unsplash: React.FC<Props> = ({ showUnsplashModal, onPhotoSelected, onClose }) => {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState<string>('');
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>();
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchValue, setSearch] = useState('');
    const { space } = useTheme();
    const { t } = useTranslation();

    const modalMinWidth = useBreakpointValue({
        base: 320,
        lg: 700,
    });

    const imageSize = useBreakpointValue({
        base: 100,
        lg: 175,
    });

    const containerMaxHeight = useBreakpointValue({
        base: 300,
        lg: 600,
    });

    useEffect(() => {
        const controller = new AbortController();
        (async function () {
            try {
                setIsLoading(true);
                const data = await fetch(`https://api.unsplash.com/search/photos?query=${searchValue || 'Schule'}&page=${pageIndex}&per_page=9`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH}`,
                    },
                    signal: controller.signal,
                });
                const res = await data.json();
                setTotalPages(res.total_pages);
                setPhotos(res.results || []);
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
                console.error(e);
            }
        })();

        return () => controller.abort();
    }, [searchValue, pageIndex]);

    const pickPhoto = useCallback(() => {
        onPhotoSelected(selectedPhoto);
        setSelectedPhoto('');
    }, [onPhotoSelected, selectedPhoto]);

    const closeModal = () => {
        onClose();
    };

    return (
        <Modal isOpen={showUnsplashModal} onClose={() => closeModal()}>
            <Modal.Content minW={modalMinWidth}>
                <Modal.Header>{t('course.unsplash.heading')}</Modal.Header>
                <Modal.CloseButton />
                <Modal.Body>
                    <Stack space={space['1']}>
                        <Text>{t('course.unsplash.description')}</Text>
                        <Row>
                            <SearchBar
                                placeholder={t('course.unsplash.placeholder')}
                                onSearch={(value: string) => {
                                    setPageIndex(1);
                                    setSearch(value);
                                }}
                                autoSubmit
                            />
                        </Row>
                        {isLoading && <CenterLoadingSpinner />}
                        {!isLoading && (
                            <View flex="1" overflowY="scroll">
                                {photos.length > 0 ? (
                                    <VStack justifyContent="space-between" maxW="800" maxH={containerMaxHeight}>
                                        <HStack flex="1" flexWrap="wrap" justifyContent="center">
                                            {photos.map((photo: any) => {
                                                return (
                                                    <VStack padding="1">
                                                        <Pressable
                                                            onPress={() =>
                                                                selectedPhoto === photo.urls.regular
                                                                    ? setSelectedPhoto('')
                                                                    : setSelectedPhoto(photo.urls.regular)
                                                            }
                                                        >
                                                            <Image
                                                                size={imageSize}
                                                                padding="2"
                                                                borderColor="primary.500"
                                                                borderWidth={selectedPhoto === photo.urls.regular ? '3' : '0'}
                                                                src={photo.urls.small}
                                                                alt={photo.alt_description}
                                                            />
                                                        </Pressable>
                                                    </VStack>
                                                );
                                            })}
                                        </HStack>
                                    </VStack>
                                ) : (
                                    <Flex flex="1" justifyContent="center" alignItems="center" minH="400">
                                        <Text>{t('course.unsplash.noSearchoResults')}</Text>
                                    </Flex>
                                )}
                            </View>
                        )}

                        <UnsplashPagination
                            currentIndex={pageIndex}
                            totalPagesCount={totalPages}
                            onPageChange={(index) => {
                                setPageIndex(index);
                            }}
                        />
                    </Stack>
                </Modal.Body>
                <Modal.Footer bgColor="primary.900">
                    <Box alignItems="flex-end" justifyContent="center" paddingRight={space['0.5']}>
                        <DisableableButton isDisabled={!selectedPhoto} reasonDisabled={t('course.unsplash.tooltipBtn')} onPress={pickPhoto}>
                            {t('course.unsplash.choose')}
                        </DisableableButton>
                    </Box>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};
export default Unsplash;
