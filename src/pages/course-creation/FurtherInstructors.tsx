import { FormControl, Heading, Row, useTheme, VStack, Text, Tooltip, InfoIcon, Switch } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LFInstructor } from '../../types/lernfair/Course';
import InstructorRow from '../../widgets/InstructorRow';
import { CreateCourseContext } from '../CreateCourse';
import AddInstructorWidget from './AddInstructorWidget';
import ButtonRow from './ButtonRow';

type InstructorProps = {
    onRemove: (index: number, isSubmitted: boolean) => Promise<void>;
    onNext: () => void;
    onBack: () => void;
    addInstructor: (instructor: LFInstructor) => void;
};

const FurtherInstructors: React.FC<InstructorProps> = ({ onRemove, onNext, onBack, addInstructor }) => {
    const { space } = useTheme();
    const { t } = useTranslation();

    const { joinAfterStart, setJoinAfterStart, allowContact, setAllowContact, addedInstructors, newInstructors } = useContext(CreateCourseContext);
    const [join, setJoin] = useState<boolean>(joinAfterStart || false);
    const [allow, setAllow] = useState<boolean>(allowContact || false);

    const onNextStep = useCallback(() => {
        setJoinAfterStart && setJoinAfterStart(join);
        setAllowContact && setAllowContact(allow);
        onNext();
    }, [allow, join, onNext, setAllowContact, setJoinAfterStart]);

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
                    <Row space={space['0.5']} my={space['1']}>
                        <AddInstructorWidget addInstructor={addInstructor} />
                    </Row>
                </FormControl>
                <VStack space={space['0.5']}>
                    <Heading fontSize="md">{t('course.CourseDate.form.otherHeadline')}</Heading>
                    <Row>
                        <Text flex="1">
                            {t('course.CourseDate.form.otherOptionStart')}
                            <Tooltip maxWidth={500} label={t('course.CourseDate.form.otherOptionStartToolTip')}>
                                <InfoIcon position="relative" top="3px" paddingLeft="5px" color="danger.100" />
                            </Tooltip>
                        </Text>
                        <Switch value={join} onValueChange={setJoin} />
                    </Row>
                    <Row marginBottom={space['2']}>
                        <Text flex="1" justifyContent="center">
                            {t('course.CourseDate.form.otherOptionContact')}
                            <Tooltip maxWidth={500} label={t('course.CourseDate.form.otherOptionContactToolTip')}>
                                <InfoIcon paddingLeft="5px" position="relative" top="3px" color="danger.100" />
                            </Tooltip>
                        </Text>
                        <Switch value={allow} onValueChange={setAllow} />
                    </Row>
                </VStack>
            </VStack>
            <ButtonRow isDisabled={false} onNext={onNextStep} onBack={onBack} />
        </>
    );
};

export default FurtherInstructors;
