import { VStack, useTheme, Heading, Text, Column, Button } from 'native-base';
import { useContext } from 'react';
import { containsDAZ, DAZ } from '../../../types/subject';
import { SubjectSelector } from '../../../widgets/SubjectSelector';
import { RequestMatchContext } from './RequestMatch';

const Subjects: React.FC = () => {
    const { space } = useTheme();
    const { matchRequest, setSubject, removeSubject, setCurrentIndex } = useContext(RequestMatchContext);

    const isDAZ = containsDAZ(matchRequest.subjects);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Fachauswahl</Heading>
            <Heading>In welchen Fächern brauchst du Hilfe?</Heading>
            {isDAZ && <Text>Du kannst maximal 1 Fach auswählen.</Text>}
            <SubjectSelector subjects={matchRequest.subjects.filter(it => it.name !== DAZ).map(it => it.name)} addSubject={it => setSubject({ name: it, mandatory: false })} removeSubject={removeSubject} limit={isDAZ ? 1 : undefined} />
            <Button
                isDisabled={matchRequest.subjects.length === 0}
                onPress={() => setCurrentIndex(4)} // 4 = priorities
            >
                Weiter
            </Button>
            <Button
                variant="outline"
                onPress={() => setCurrentIndex(2)} // 2 = german
            >
                Zurück
            </Button>
        </VStack>
    );
};
export default Subjects;
