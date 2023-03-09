import { Button, Column, FormControl, Heading, Row, Select, Tag, useBreakpointValue, useTheme, VStack } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Course_Category_Enum } from '../../gql/graphql';
import Tags from '../../modals/Tags';
import { LFTag } from '../../types/lernfair/Course';
import { SubjectSelector } from '../../widgets/SubjectSelector';
import { CreateCourseContext } from '../CreateCourse';
import ButtonRow from './ButtonRow';

type SubjectProps = {
    onNext: () => any;
    onBack: () => any;
};
const CourseSubject: React.FC<SubjectProps> = ({ onNext, onBack }) => {
    const { space, sizes, colors } = useTheme();
    const { t } = useTranslation();
    const { courseCategory, setCourseCategory, subject, setSubject, tags, setTags } = useContext(CreateCourseContext);

    const [category, setCategory] = useState<string>(courseCategory || '');
    const [courseSubject, setCourseSubject] = useState<string | null>(subject || null);
    const [courseTags, setCourseTags] = useState<LFTag[]>(tags || []);

    const [showTagsModal, setShowTagsModal] = useState<boolean>(false);

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });
    const onNextStep = useCallback(() => {
        setCourseCategory && setCourseCategory(category);
        setSubject && setSubject(courseSubject);
        setTags && setTags(courseTags);
        onNext();
    }, []);

    return (
        <>
            <VStack space={space['1']} marginX="auto" width="100%" maxWidth={ContentContainerWidth}>
                <Heading>{t('course.CourseDate.subjectHeadline')}</Heading>
                <FormControl>
                    <Select selectedValue={category} placeholder={t('course.CourseDate.form.courseCategory')} onValueChange={(e) => setCategory(e)}>
                        <Select.Item value={Course_Category_Enum.Revision} label={'Nachhilfe'} />
                        <Select.Item value={Course_Category_Enum.Language} label={'Deutsch'} />
                        <Select.Item value={Course_Category_Enum.Focus} label={'Fokus'} />
                    </Select>
                </FormControl>
                {category === Course_Category_Enum.Revision && (
                    <FormControl marginBottom={space['0.5']}>
                        <FormControl.Label _text={{ color: 'primary.900' }}>{t('course.CourseDate.form.courseSubjectLabel')}</FormControl.Label>
                        <SubjectSelector
                            subjects={courseSubject ? [courseSubject] : []}
                            addSubject={(it) => setCourseSubject(it)}
                            removeSubject={() => setCourseSubject(null)}
                            limit={1}
                        />
                    </FormControl>
                )}

                <FormControl marginBottom={space['0.5']}>
                    <FormControl.Label _text={{ color: 'primary.900' }} marginBottom="5px">
                        {t('course.CourseDate.form.tagsLabel')}
                    </FormControl.Label>

                    <Row>
                        {tags?.map((tag: LFTag) => (
                            <Column mr={space['0.5']}>
                                <Tag text={tag.name} />
                            </Column>
                        ))}
                    </Row>
                    <Button isDisabled={!category} width={ButtonContainer} marginBottom={space['1']} onPress={() => setShowTagsModal(true)}>
                        {t('course.CourseDate.form.tagsEdit')}
                    </Button>
                </FormControl>
                <ButtonRow isDisabled={false} onNext={onNextStep} onBack={onBack} />
            </VStack>
            <Tags
                isOpen={showTagsModal}
                onClose={() => setShowTagsModal(false)}
                selections={tags || []}
                onSelectTag={(tag: LFTag) => setCourseTags((prev) => [...prev, tag])}
                onDeleteTag={(index: number) => {
                    const arr = (tags && tags?.length > 0 && [...tags]) || [];
                    arr.splice(index, 1);
                    setCourseTags(arr);
                }}
                category={category ?? 'revision'}
            />
        </>
    );
};

export default CourseSubject;
