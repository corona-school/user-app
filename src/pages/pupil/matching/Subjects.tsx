import { VStack, useTheme, Heading, Text } from 'native-base';
import { useContext, useEffect, useState } from 'react';
import { containsDAZ, DAZ } from '../../../types/subject';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import { SubjectSelector } from '../../../widgets/SubjectSelector';
import { RequestMatchContext } from './RequestMatch';
import { useTranslation } from 'react-i18next';

const Subjects: React.FC = () => {
    const { space } = useTheme();
    const { matchRequest, setSubject, removeSubject, setCurrentIndex, setSkippedSubjectPriority } = useContext(RequestMatchContext);
    const { t } = useTranslation();

    const isDAZ = containsDAZ(matchRequest.subjects);
    const [skipPrio, setSkipPrio] = useState(isDAZ || matchRequest.subjects.length === 1);

    useEffect(() => {
        setSkipPrio(isDAZ || matchRequest.subjects.length === 1);
        setSkippedSubjectPriority(skipPrio);
    }, [matchRequest.subjects.length, skipPrio]);

    //TBD: if (skipPrio): set subject on mandatory after unmount
    useEffect(
        () => () => {
            /* if(skipPrio) setSubject... */
        },
        []
    );

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">{t('matching.wizard.pupil.subjects.heading')}</Heading>
            <Heading>{t('matching.wizard.pupil.subjects.subheading')}</Heading>
            {isDAZ && <Text>{t('matching.wizard.pupil.subjects.text')}</Text>}
            <SubjectSelector
                subjects={matchRequest.subjects.filter((it) => it.name !== DAZ).map((it) => it.name)}
                addSubject={(it) => setSubject({ name: it, mandatory: skipPrio })}
                removeSubject={removeSubject}
                limit={isDAZ ? 1 : undefined}
            />
            <NextPrevButtons
                disablingNext={{
                    is: matchRequest.subjects.length === 0 || (matchRequest.subjects.length === 1 && isDAZ),
                    reason: isDAZ ? t('matching.wizard.pupil.subjects.reason_btn_disabled_DAZ') : t('matching.wizard.pupil.subjects.reason_btn_disabled'),
                }}
                onPressPrev={() => setCurrentIndex(2)}
                onPressNext={() => setCurrentIndex(skipPrio ? 5 : 4)}
            />
        </VStack>
    );
};
export default Subjects;
