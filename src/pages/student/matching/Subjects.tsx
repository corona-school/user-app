import { Heading, useTheme, VStack } from 'native-base';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RequestMatchContext } from './RequestMatch';
import { SubjectSelectorGrouped } from '../../../widgets/SubjectSelectorGrouped';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import { SingleSubject } from '../../../types/subject';

interface SubjectsProps {
    onNext: () => void;
    onBack: () => void;
}

const Subjects = ({ onBack, onNext }: SubjectsProps) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { matchRequest, removeSubject, setSubject } = useContext(RequestMatchContext);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">{t('matching.wizard.student.subjects.title')}</Heading>
            <SubjectSelectorGrouped
                subjects={matchRequest.subjects.map((it) => it.name) as SingleSubject[]}
                addSubject={(it) => setSubject({ name: it, grade: { min: 1, max: 14 } })}
                removeSubject={removeSubject}
                justifyContent={'flex-start'}
            />
            <NextPrevButtons
                disablingNext={{ is: matchRequest.subjects.length === 0, reason: t('matching.wizard.student.subjects.reason_btn_disabled') }}
                onPressPrev={onBack}
                onPressNext={onNext}
            />
        </VStack>
    );
};
export default Subjects;
