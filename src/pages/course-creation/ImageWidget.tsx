import { Column, Pressable, Image, useTheme, Link, Button } from 'native-base';
import { useTranslation } from 'react-i18next';
import ImagePlaceHolder from '../../assets/images/globals/image-placeholder.png';

type WidgetProps = {
    photo: string | undefined;
    onShowUnsplash: () => void;
    onDeletePhoto?: () => void;
    prefill?: string;
};

const ImageWidget: React.FC<WidgetProps> = ({ photo, onShowUnsplash, onDeletePhoto, prefill }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
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
                    <Link>{t('course.CourseDate.form.changeImage')}</Link>
                </Column>
            </Pressable>
            {photo && (
                <Button variant="link" justifyContent="flex-start" pl="0" onPress={onDeletePhoto}>
                    {prefill ? t('course.CourseDate.Image.resetPhoto') : t('course.CourseDate.Image.deletePhoto')}
                </Button>
            )}
        </>
    );
};

export default ImageWidget;
