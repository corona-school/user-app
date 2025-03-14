import { VStack, useTheme, Heading, Text } from 'native-base';
import { useContext, useEffect } from 'react';
import { containsDAZ, DAZ } from '../../../types/subject';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import { SubjectSelector } from '../../../widgets/SubjectSelector';
import { RequestMatchContext, RequestMatchStep } from './RequestMatch';
import { useTranslation } from 'react-i18next';

const Subjects: React.FC = () => {
    const { space } = useTheme();
    const { matchRequest, setSubject, removeSubject, setCurrentStep, setSkippedSubjectPriority, skippedSubjectPriority, setSubjectPriority, requestMatch } =
        useContext(RequestMatchContext);
    const { t } = useTranslation();

    const isDAZ = containsDAZ(matchRequest.subjects);

    useEffect(() => {
        const skipSubjectPriority = isDAZ || matchRequest.subjects.length === 1;
        setSkippedSubjectPriority(skipSubjectPriority);
        matchRequest.subjects.forEach((subj) => setSubjectPriority(subj.name, skipSubjectPriority));
    }, [matchRequest.subjects.length, isDAZ, setSkippedSubjectPriority, setSubjectPriority]);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">{t('matching.wizard.pupil.subjects.heading')}</Heading>
            <Heading>{t('matching.wizard.pupil.subjects.subheading')}</Heading>
            {isDAZ && <Text>{t('matching.wizard.pupil.subjects.text')}</Text>}
            <SubjectSelector
                subjects={matchRequest.subjects.filter((it) => it.name !== DAZ).map((it) => it.name)}
                addSubject={(it) => setSubject({ name: it, mandatory: skippedSubjectPriority })}
                removeSubject={removeSubject}
                limit={isDAZ ? 1 : undefined}
            />
            <NextPrevButtons
                disablingNext={{
                    is: matchRequest.subjects.length === 0 || (matchRequest.subjects.length === 1 && isDAZ),
                    reason: isDAZ ? t('matching.wizard.pupil.subjects.reason_btn_disabled_DAZ') : t('matching.wizard.pupil.subjects.reason_btn_disabled'),
                }}
                onPressPrev={() => setCurrentStep(RequestMatchStep.german)}
                onPressNext={() => {
                    skippedSubjectPriority ? requestMatch() : setCurrentStep(RequestMatchStep.priority);
                }}
            />
        </VStack>
    );
};
export default Subjects;
