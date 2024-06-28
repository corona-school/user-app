import { Heading, useTheme, VStack } from 'native-base';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RequestMatchContext } from './RequestMatch';
import { SubjectSelectorGrouped } from '../../../widgets/SubjectSelectorGrouped';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';

const Subjects: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { matchRequest, removeSubject, setSubject, setCurrentIndex } = useContext(RequestMatchContext);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">{t('matching.wizard.student.subjects.title')}</Heading>
            <SubjectSelectorGrouped
                subjects={matchRequest.subjects.map((it) => it.name)}
                addSubject={(it) => setSubject({ name: it, grade: { min: 1, max: 14 } })}
                removeSubject={removeSubject}
                includeDaz
                justifyContent={'flex-start'}
            />
            <NextPrevButtons
                disablingNext={{ is: matchRequest.subjects.length === 0, reason: t('matching.wizard.student.subjects.reason_btn_disabled') }}
                onPressPrev={() => setCurrentIndex(0)}
                onPressNext={() => setCurrentIndex(2)}
            />
        </VStack>
    );
};
export default Subjects;
