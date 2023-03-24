import { HStack, Pressable, Stack } from 'native-base';
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
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState<string>('');
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [lastSearch, setLastSearch] = useState<string>('Lernen');
    const [isLoading, setIsLoading] = useState<boolean>();
    const { space } = useTheme();
    const { t } = useTranslation();

    const loadPhotos = useCallback(async () => {
        const data = await fetch(`https://api.unsplash.com/search/photos?query=${lastSearch}&page=${pageIndex}&per_page=5`, {
            method: 'GET',
            headers: {
                Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH}`,
            },
        });
        const res = await data.json();
        console.log('RESULT', res, res.results);
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
        loadPhotos();
    }, []);

    if (isLoading) return <CenterLoadingSpinner />;
    return (
        <Modal isOpen={showUnsplashModal} onClose={onClose}>
            <Modal.Content minW="800" minH="800">
                <Modal.Header>{t('course.unsplash.heading')}</Modal.Header>
                <Modal.CloseButton />
                <Modal.Body>
                    <SearchBar onSearch={() => search()} onChangeText={setLastSearch} value={lastSearch} />
                    <Stack overflowY="scroll" h="500">
                        {photos.map((photo: any) => (
                            <TouchableWithoutFeedback onPress={() => console.log('CHOOSE THIS PIC')}>
                                <Image height="25%" width="25%" src={photo.urls.small} alt={photo.alt_description} />
                            </TouchableWithoutFeedback>
                        ))}
                    </Stack>
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
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );
};
export default Unsplash;
