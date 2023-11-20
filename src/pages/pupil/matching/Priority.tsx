import { Text, VStack, Heading, useTheme } from 'native-base';
import { useContext } from 'react';
import { DAZ } from '../../../types/subject';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import { SubjectSelector } from '../../../widgets/SubjectSelector';
import { RequestMatchContext } from './RequestMatch';
import { useTranslation } from 'react-i18next';

const Priority: React.FC = () => {
    const { space } = useTheme();
    const { matchRequest, setSubject, setCurrentIndex } = useContext(RequestMatchContext);
    const { t } = useTranslation();

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">{t('matching.wizard.pupil.priority.heading')}</Heading>
            <Heading>{t('matching.wizard.pupil.priority.subheading')}</Heading>

            <Text>{t('matching.wizard.pupil.priority.text')}</Text>

            <SubjectSelector
                subjects={matchRequest.subjects.filter((it) => it.mandatory && it.name !== DAZ).map((it) => it.name)}
                selectable={matchRequest.subjects.filter((it) => it.name !== DAZ).map((it) => it.name)}
                addSubject={(it) => setSubject({ name: it, mandatory: true })}
                removeSubject={(it) => setSubject({ name: it, mandatory: false })}
                limit={1}
            />
            <NextPrevButtons
                isDisabledNext={matchRequest.subjects.every((it) => !it.mandatory)}
                onPressPrev={() => setCurrentIndex(3)}
                onPressNext={() => setCurrentIndex(5)}
            />
        </VStack>
    );
};
export default Priority;
