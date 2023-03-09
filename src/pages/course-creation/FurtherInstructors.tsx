import { FormControl, Heading, Row, useTheme, VStack } from 'native-base';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LFInstructor } from '../../types/lernfair/Course';
import InstructorRow from '../../widgets/InstructorRow';
import { CreateCourseContext } from '../CreateCourse';
import AddInstructorWidget from './AddInstructorWidget';
import ButtonRow from './ButtonRow';

type InstructorProps = {
    onRemove: (index: number, isSubmitted: boolean) => any;
    onNext: () => any;
    onBack: () => any;
    onShowAddInstructor: () => any;
};

const FurtherInstructors: React.FC<InstructorProps> = ({ onRemove, onNext, onBack, onShowAddInstructor }) => {
    const { space, sizes, colors } = useTheme();
    const { t } = useTranslation();

    const { addedInstructors, newInstructors } = useContext(CreateCourseContext);

    const onNextStep = useCallback(() => {
        onNext();
    }, []);

    return (
        <>
            <VStack>
                <FormControl marginBottom={space['0.5']}>
                    <Heading>{t('course.CourseDate.form.furtherCourseInstructors')}</Heading>
                    <VStack mt={space['1']}>
                        {addedInstructors &&
                            addedInstructors.map((instructor: LFInstructor, index: number) => (
                                <InstructorRow instructor={instructor} onPressDelete={() => onRemove(index, true)} />
                            ))}
                        {newInstructors &&
                            newInstructors.map((instructor: LFInstructor, index: number) => (
                                <InstructorRow instructor={instructor} onPressDelete={() => onRemove(index, false)} />
                            ))}
                    </VStack>
                    <Row space={space['0.5']} mt={space['1']}>
                        <AddInstructorWidget onPress={onShowAddInstructor} />
                    </Row>
                </FormControl>
            </VStack>
            <ButtonRow isDisabled={false} onNext={onNextStep} onBack={onBack} />
        </>
    );
};

export default FurtherInstructors;
