import { VStack, useTheme, Heading, Text } from 'native-base';
import { useContext } from 'react';
import { containsDAZ, DAZ } from '../../../types/subject';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import { SubjectSelector } from '../../../widgets/SubjectSelector';
import { RequestMatchContext } from './RequestMatch';
import { useTranslation } from 'react-i18next';

const Subjects: React.FC = () => {
    const { space } = useTheme();
    const { matchRequest, setSubject, removeSubject, setCurrentIndex } = useContext(RequestMatchContext);
    const { t } = useTranslation();

    const isDAZ = containsDAZ(matchRequest.subjects);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">{t('matching.wizard.pupil.subjects.heading')}</Heading>
            <Heading>{t('matching.wizard.pupil.subjects.subheading')}</Heading>
            {isDAZ && <Text>{t('matching.wizard.pupil.subjects.text')}</Text>}
            <SubjectSelector
                subjects={matchRequest.subjects.filter((it) => it.name !== DAZ).map((it) => it.name)}
                addSubject={(it) => setSubject({ name: it, mandatory: false })}
                removeSubject={removeSubject}
                limit={isDAZ ? 1 : undefined}
            />
            <NextPrevButtons
                disablingNext={{ is: matchRequest.subjects.length === 0, reason: t('matching.wizard.pupil.subjects.reason_btn_disabled') }}
                onPressPrev={() => setCurrentIndex(2)}
                onPressNext={() => setCurrentIndex(4)}
            />
        </VStack>
    );
};
export default Subjects;
