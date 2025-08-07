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

    const {
        joinAfterStart,
        setJoinAfterStart,
        allowProspectContact,
        setAllowProspectContact,
        allowParticipantContact,
        setAllowParticipantContact,
        allowChatWritting,
        setAllowChatWritting,
        existingInstructors,
        newInstructors,
        myself,
    } = useContext(CreateCourseContext);
    const [join, setJoin] = useState<boolean>(joinAfterStart || false);
    const [allowProspect, setAllowProspect] = useState<boolean>(allowProspectContact || false);
    const [allowParticipant, setAllowParticipant] = useState<boolean>(allowParticipantContact || false);
    const [allowWrite, setAllowWrite] = useState<boolean>(allowChatWritting || false);

    const onNextStep = useCallback(() => {
        setJoinAfterStart && setJoinAfterStart(join);
        setAllowProspectContact && setAllowProspectContact(allowProspect);
        setAllowParticipantContact && setAllowParticipantContact(allowParticipant);
        setAllowChatWritting && setAllowChatWritting(allowWrite);
        onNext();
    }, [
        allowParticipant,
        allowProspect,
        allowWrite,
        join,
        onNext,
        setAllowChatWritting,
        setAllowParticipantContact,
        setAllowProspectContact,
        setJoinAfterStart,
    ]);

    return (
        <>
            <VStack>
                <FormControl marginBottom={space['0.5']}>
                    <Heading>{t('course.CourseDate.step.settings')}</Heading>
                    <VStack mt={space['1']}>
                        <Heading fontSize="md">{t('course.CourseDate.form.CourseInstructors')}</Heading>
                        {myself && <InstructorRow instructor={myself}></InstructorRow>}
                        {existingInstructors &&
                            existingInstructors.map((instructor: LFInstructor, index: number) => (
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
                <VStack space={space['1']}>
                    <Heading fontSize="lg">{t('course.CourseDate.form.otherHeadline')}</Heading>
                    <Row>
                        <Text flex="1">
                            {t('course.CourseDate.form.otherOptionStart')}
                            <Tooltip maxWidth={500} label={t('course.CourseDate.form.otherOptionStartToolTip')}>
                                <InfoIcon position="relative" top="3px" paddingLeft="5px" color="danger.100" />
                            </Tooltip>
                        </Text>
                        <Switch value={join} onValueChange={setJoin} />
                    </Row>
                    <Heading fontSize="md">{t('course.CourseDate.form.otherContactHeadline')}</Heading>
                    <Text flex="1" justifyContent="center">
                        {t('course.CourseDate.form.otherOptionContact')}
                    </Text>

                    <Row ml="10">
                        <Text flex="1">
                            {t('course.CourseDate.form.otherProspects')}
                            <Tooltip maxWidth={500} label={t('course.CourseDate.form.prospectContactTooltip')}>
                                <InfoIcon position="relative" top="3px" paddingLeft="5px" color="danger.100" />
                            </Tooltip>
                        </Text>
                        <Switch value={allowProspect} onToggle={() => setAllowProspect(!allowProspect)} />
                    </Row>

                    <Row ml="10">
                        <Text flex="1">
                            {t('course.CourseDate.form.otherParticipants')}
                            <Tooltip maxWidth={500} label={t('course.CourseDate.form.participantsContactTooltip')}>
                                <InfoIcon position="relative" top="3px" paddingLeft="5px" color="danger.100" />
                            </Tooltip>
                        </Text>
                        <Switch value={allowParticipant} onToggle={() => setAllowParticipant(!allowParticipant)} />
                    </Row>

                    <Heading mt="5" fontSize="md">
                        {t('course.CourseDate.form.otherGroupChatHeadline')}
                    </Heading>
                    <Row marginBottom={space['2']}>
                        <Text flex="1" justifyContent="center">
                            {t('course.CourseDate.form.allowChatContact')}
                        </Text>
                        <Switch value={allowWrite} onToggle={() => setAllowWrite(!allowWrite)} />
                    </Row>
                </VStack>
            </VStack>
            <ButtonRow isDisabled={false} onNext={onNextStep} onBack={onBack} />
        </>
    );
};

export default FurtherInstructors;
