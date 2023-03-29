import { HStack, Pressable, View, Text, VStack, Button, Image, Box, Flex, useTheme, Row, Modal, Stack, useBreakpointValue } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import SearchBar from '../components/SearchBar';
import UnsplashPagination from '../components/UnsplashPagination';

type Props = {
    showUnsplashModal: boolean;
    onPhotoSelected: (photoUrl: string) => void;
    onClose: () => void;
};

const Unsplash: React.FC<Props> = ({ showUnsplashModal, onPhotoSelected, onClose }) => {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState<string>('');
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [lastSearch, setLastSearch] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>();
    const [totalPages, setTotalPages] = useState<number>(1);
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
    const loadPhotos = useCallback(async () => {
        try {
            const data = await fetch(
                `https://api.unsplash.com/search/photos?query=${lastSearch.length > 0 ? lastSearch : 'Schule'}&page=${pageIndex}&per_page=9`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH}`,
                    },
                }
            );
            const res = await data.json();
            setTotalPages(res.total_pages);
            setPhotos(res.results);
        } catch (e) {
            setIsLoading(false);
            console.error(e);
        }
    }, [lastSearch, pageIndex]);

    const search = useCallback(async () => {
        setIsLoading(true);
        await loadPhotos();
        setIsLoading(false);
    }, [loadPhotos]);

    const pickPhoto = useCallback(() => {
        onPhotoSelected(selectedPhoto);
        setSelectedPhoto('');
    }, [onPhotoSelected, selectedPhoto]);

    const closeModal = () => {
        onClose();
        setLastSearch('');
    };

    useEffect(() => {
        loadPhotos();
    }, [loadPhotos]);

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
                                onSearch={() => {
                                    setPageIndex(1);
                                    search();
                                }}
                                onChangeText={setLastSearch}
                                value={lastSearch}
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
                                search();
                            }}
                        />
                    </Stack>
                </Modal.Body>
                <Modal.Footer bgColor="primary.900">
                    <Box alignItems="flex-end" justifyContent="center" paddingRight={space['0.5']}>
                        <Button onPress={pickPhoto} isDisabled={!selectedPhoto}>
                            {t('course.unsplash.choose')}
                        </Button>
                    </Box>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};
export default Unsplash;
