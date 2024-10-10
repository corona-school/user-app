import { Button } from '@/components/Button';
import { useTranslation } from 'react-i18next';
import ImagePlaceHolder from '../../assets/images/globals/image-placeholder.png';

interface ImageWidgetProps {
    photo: string | undefined;
    onShowUnsplash: () => void;
    onDeletePhoto?: () => void;
    prefill?: string;
}

const ImageWidget = ({ photo, onShowUnsplash, onDeletePhoto, prefill }: ImageWidgetProps) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="flex flex-row items-center">
                <div className="mr-1">
                    <img className="size-32 object-cover rounded-md" alt="Placeholder" src={photo || prefill || ImagePlaceHolder} />
                </div>
                <div>
                    <Button className="underline" variant="link" onClick={onShowUnsplash}>
                        {t('course.CourseDate.form.changeImage')}
                    </Button>
                </div>
            </div>
            {photo && (
                <Button className="underline" variant="link" onClick={onDeletePhoto}>
                    {prefill ? t('course.CourseDate.Image.resetPhoto') : t('course.CourseDate.Image.deletePhoto')}
                </Button>
            )}
        </>
    );
};

export default ImageWidget;
