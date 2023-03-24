import { View, Text, VStack, Button, Image, Box, Flex, useTheme, Row, Column, AspectRatio, Modal } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableWithoutFeedback } from 'react-native';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';

type Props = {
    showUnsplashModal: boolean;
    onPhotoSelected: (photo: string) => any;
    onClose: () => any;
};

const Unsplash: React.FC<Props> = ({ showUnsplashModal, onPhotoSelected, onClose }) => {
    const { space } = useTheme();
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState<boolean>();
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState<string>('');
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [lastSearch, setLastSearch] = useState<string>('Lernen');

    const loadPhotos = useCallback(async () => {
        const data = await fetch(`https://api.unsplash.com/search/photos?query=${lastSearch}&page=${pageIndex}&per_page=5`, {
            method: 'GET',
            headers: {
                Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH}`,
            },
        });
        const res = await data.json();
        setPhotos(res.results);
    }, [lastSearch, pageIndex]);

    const search = useCallback(async () => {
        setIsLoading(true);
        loadPhotos();
        setIsLoading(false);
    }, [loadPhotos]);

    const pickPhoto = useCallback(() => {
        onPhotoSelected && onPhotoSelected(selectedPhoto);
        setSelectedPhoto('');
    }, [onPhotoSelected, selectedPhoto]);

    useEffect(() => {
        setPageIndex(1);
    }, [lastSearch]);

    useEffect(() => {
        loadPhotos();
    }, []);

    if (isLoading) return <CenterLoadingSpinner />;
    return (
        <Modal isOpen={showUnsplashModal} onClose={onClose}>
            <Modal.Content minW="800">
                <Modal.Header>{t('course.unsplash.heading')}</Modal.Header>
                <Modal.CloseButton />
                <Modal.Body>
                    <VStack flex="1" overflowY="scroll" h="100%">
                        <Row w="100%" paddingX={space['1']} paddingY={space['0.5']}>
                            <SearchBar onSearch={(s) => search()} onChangeText={setLastSearch} value={lastSearch} />
                        </Row>
                        <View overflowY={'scroll'} flex="1">
                            {(photos.length > 0 && (
                                <VStack pb={'72px'} marginX={space['1']}>
                                    <Row flex="1" flexWrap={'wrap'} marginX={-space['0.5']}>
                                        {photos?.map((photo: any) => (
                                            <TouchableWithoutFeedback
                                                onPress={() =>
                                                    selectedPhoto === photo.urls.regular ? setSelectedPhoto('') : setSelectedPhoto(photo.urls.regular)
                                                }
                                            >
                                                {/* <Column flex={{ base: '50%', lg: '25%' }} padding={space['0.5']}>
                                                    <AspectRatio ratio={16 / 9} w="100%"> */}
                                                <>
                                                    <Image src={photo.urls.small} height="100%" />
                                                    {selectedPhoto === photo.urls.regular && (
                                                        <Box position={'absolute'} w="100%" h="100%" bgColor="primary.900" opacity={0.8}></Box>
                                                    )}
                                                </>
                                                {/* </AspectRatio>
                                                </Column> */}
                                            </TouchableWithoutFeedback>
                                        ))}
                                    </Row>

                                    <Pagination
                                        currentIndex={pageIndex}
                                        onPrev={() => {
                                            setPageIndex((prev) => prev - 1);
                                            search();
                                        }}
                                        onNext={() => {
                                            setPageIndex((prev) => prev + 1);
                                            search();
                                        }}
                                        onSelectIndex={(index) => {
                                            setPageIndex(index);
                                            search();
                                        }}
                                    />
                                </VStack>
                            )) || (
                                <Flex flex="1" justifyContent="center" alignItems="center">
                                    <Text>{t('course.unsplash.noSearchoResults')}</Text>
                                </Flex>
                            )}
                            {selectedPhoto && (
                                <Box
                                    bgColor="primary.900"
                                    w="100%"
                                    h="64px"
                                    position={'fixed'}
                                    bottom="0"
                                    alignItems={'flex-end'}
                                    justifyContent={'center'}
                                    paddingRight={space['0.5']}
                                >
                                    <Button onPress={pickPhoto} isDisabled={!selectedPhoto}>
                                        {t('course.unsplash.choose')}
                                    </Button>
                                </Box>
                            )}
                        </View>
                    </VStack>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};
export default Unsplash;
