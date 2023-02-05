import { VStack, useTheme, Heading, Column, Button } from 'native-base';
import { useContext } from 'react';
import { subjects } from '../../../types/lernfair/Subject';
import IconTagList from '../../../widgets/IconTagList';
import TwoColGrid from '../../../widgets/TwoColGrid';
import { RequestMatchContext } from './RequestMatch';

const Subjects: React.FC = () => {
    const { space } = useTheme();
    const { matchRequest, removeSubject, setSubject, setCurrentIndex } = useContext(RequestMatchContext);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Fachauswahl</Heading>
            <Heading>In welchen Fächern möchtest du unterstützen?</Heading>

            <TwoColGrid>
                {subjects.map((subject) => (
                    <Column>
                        <IconTagList
                            initial={matchRequest.subjects.some(it => it.name === subject.key)}
                            variant="selection"
                            text={subject.label}
                            iconPath={`subjects/icon_${subject.key}.svg`}
                            onPress={() => {
                                if (!matchRequest.subjects.some(it => it.name === subject.key)) {
                                    setSubject({ name: subject.key, grade: { min: 1, max: 13 }})
                                } else {
                                    removeSubject(subject.key);
                                }
                            }}
                        />
                    </Column>
                ))}
            </TwoColGrid>
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
