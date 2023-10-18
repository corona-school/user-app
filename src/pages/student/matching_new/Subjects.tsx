import { Box, Button, Column, Heading, HStack, Row, useTheme, VStack } from 'native-base';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RequestMatchContext } from './RequestMatch';
import { SubjectSelector } from '../../../widgets/SubjectSelector';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';

const Subjects: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { matchRequest, removeSubject, setSubject, setCurrentIndex } = useContext(RequestMatchContext);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Fachauswahl</Heading>
            <Heading>In welchen Fächern möchtest du unterstützen?</Heading>
            <SubjectSelector
                subjects={matchRequest.subjects.map((it) => it.name)}
                addSubject={(it) => setSubject({ name: it, grade: { min: 1, max: 13 } })}
                removeSubject={removeSubject}
                includeDaz
            />
            <NextPrevButtons
                isDisabledNext={matchRequest.subjects.length === 0}
                onPressPrev={() => setCurrentIndex(0)}
                onPressNext={() => setCurrentIndex(2)}
            />
        </VStack>
    );
};
export default Subjects;
