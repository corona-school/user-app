import { Column, Pressable, Image, useTheme, Link, Button } from 'native-base';
import ImagePlaceHolder from '../../assets/images/globals/image-placeholder.png';

type WidgetProps = {
    photo: string | undefined;
    onShowUnsplash: () => any;
    onDeletePhoto?: () => any;
    prefill?: string;
};

const ImageWidget: React.FC<WidgetProps> = ({ photo, onShowUnsplash, onDeletePhoto, prefill }) => {
    const { space } = useTheme();

    return (
        <>
            <Pressable onPress={onShowUnsplash} flexDirection="row" alignItems="center">
                <Column marginRight={space['1']}>
                    <Image
                        width="90px"
                        height="90px"
                        alt="Image Placeholder"
                        source={{
                            uri: photo || prefill || ImagePlaceHolder,
                        }}
                    />
                </Column>
                <Column>
                    <Link>Bild ändern</Link>
                </Column>
            </Pressable>
            {photo && (
                <Button variant="link" justifyContent="flex-start" pl="0" onPress={onDeletePhoto}>
                    {prefill ? 'Bild zurücksetzen' : 'Bild löschen'}
                </Button>
            )}
        </>
    );
};

export default ImageWidget;
