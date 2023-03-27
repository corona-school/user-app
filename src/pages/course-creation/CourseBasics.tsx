import { Box, FormControl, Heading, Input, useBreakpointValue, useTheme, VStack } from 'native-base';
import { useState, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateCourseContext } from '../CreateCourse';
import ButtonRow from './ButtonRow';
import ImageWidget from './ImageWidget';
import ResizableTextArea from './ResizableTextArea';

const MAX_LENGTH_TITLE = 50;

type BasicProps = {
    onShowUnsplash: () => void;
    onCancel: () => void;
    onNext: () => void;
};

const CourseBasics: React.FC<BasicProps> = ({ onShowUnsplash, onCancel, onNext }) => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const { courseName, setCourseName, description, setDescription, pickedPhoto, setPickedPhoto } = useContext(CreateCourseContext);

    const [name, setName] = useState<string>(courseName || '');
    const [courseDescription, setCourseDescription] = useState<string>(description || '');

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const isValidInput: boolean = useMemo(() => {
        if (!name || name?.length < 3) return false;
        if (!courseDescription || courseDescription.length < 5) return false;
        return true;
    }, [name, courseDescription]);

    const deletePhoto = () => {
        if (pickedPhoto) {
            setPickedPhoto && setPickedPhoto('');
        }
    };

    const onNextStep = useCallback(() => {
        setCourseName && setCourseName(name);
        setDescription && setDescription(courseDescription);
        onNext();
    }, [courseDescription, name, onNext, setCourseName, setDescription]);

    return (
        <VStack space={space['1']} marginX="auto" width="100%" maxWidth={ContentContainerWidth}>
            <Heading>{t('course.CourseDate.headline')}</Heading>
            <FormControl>
                <FormControl.Label _text={{ color: 'primary.900' }} isRequired>
                    {t('course.CourseDate.form.courseNameHeadline')}
                </FormControl.Label>
                <Input
                    value={name}
                    placeholder={t('course.CourseDate.form.courseNamePlaceholder')}
                    onChangeText={(text) => setName(text.substring(0, MAX_LENGTH_TITLE))}
                />
            </FormControl>
            <FormControl marginBottom={space['0.5']}>
                <FormControl.Label _text={{ color: 'primary.900' }}>{t('course.CourseDate.form.coursePhotoLabel')}</FormControl.Label>
                <Box paddingY={space['1']}>
                    <ImageWidget photo={pickedPhoto} onShowUnsplash={onShowUnsplash} onDeletePhoto={deletePhoto} />
                </Box>
            </FormControl>
            <FormControl marginBottom={space['0.5']}>
                <FormControl.Label isRequired _text={{ color: 'primary.900' }}>
                    {t('course.CourseDate.form.descriptionLabel')}
                </FormControl.Label>
                <ResizableTextArea
                    value={courseDescription}
                    placeholder={t('course.CourseDate.form.descriptionPlaceholder')}
                    onChangeText={setCourseDescription}
                />
            </FormControl>
            <ButtonRow isDisabled={!isValidInput} onNext={onNextStep} onCancel={onCancel} />
        </VStack>
    );
};

export default CourseBasics;
