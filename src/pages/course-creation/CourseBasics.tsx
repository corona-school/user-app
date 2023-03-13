import { Box, FormControl, Heading, Input, TextArea, useBreakpointValue, useTheme, VStack } from 'native-base';
import { useState, useContext, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateCourseContext } from '../CreateCourse';
import ButtonRow from './ButtonRow';
import ImageWidget from './ImageWidget';

const MAX_LENGTH_TITLE = 50;

type BasicProps = {
    onShowUnsplash: () => any;
    onCancel: () => any;
    onNext: () => any;
};

const CourseBasics: React.FC<BasicProps> = ({ onShowUnsplash, onCancel, onNext }) => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const { courseName, setCourseName, description, setDescription, pickedPhoto, setPickedPhoto } = useContext(CreateCourseContext);

    const [name, setName] = useState<string>(courseName || '');
    const [courseDescription, setCourseDescription] = useState<string>(description || '');

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

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
    }, [courseDescription, name, setCourseName, setDescription]);

    return (
        <VStack space={space['1']} marginX="auto" width="100%" maxWidth={ContentContainerWidth}>
            <Heading>{t('course.CourseDate.headline')}</Heading>
            <FormControl>
                <FormControl.Label isRequired>{t('course.CourseDate.form.courseNameHeadline')}</FormControl.Label>
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
                <TextArea
                    minH={isMobile ? '30vw' : '20vw'}
                    placeholder={t('course.CourseDate.form.descriptionPlaceholder')}
                    autoCompleteType={'normal'}
                    value={courseDescription}
                    onChangeText={setCourseDescription}
                />
            </FormControl>
            <ButtonRow isDisabled={!isValidInput} onNext={onNextStep} onCancel={onCancel} />
        </VStack>
    );
};

export default CourseBasics;
