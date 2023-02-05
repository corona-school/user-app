import { VStack, useTheme, Heading, Button } from 'native-base';
import { useContext } from 'react';
import { RequestMatchContext } from './RequestMatch';
import { useTranslation } from 'react-i18next';
import { SubjectSelector } from '../../../widgets/SubjectSelector';


const Subjects: React.FC = () => {
    const { space } = useTheme();
    const { matchRequest, removeSubject, setSubject, setCurrentIndex } = useContext(RequestMatchContext);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Fachauswahl</Heading>
            <Heading>In welchen Fächern möchtest du unterstützen?</Heading>
            <SubjectSelector subjects={matchRequest.subjects} setSubject={setSubject} removeSubject={removeSubject} />
            <Button
                isDisabled={matchRequest.subjects.length === 0}
                onPress={() => setCurrentIndex(2)} // 2 = german
            >
                Weiter
            </Button>
            <Button variant="outline" onPress={() => setCurrentIndex(0)}>
                Zurück
            </Button>
        </VStack>
    );
};
export default Subjects;
