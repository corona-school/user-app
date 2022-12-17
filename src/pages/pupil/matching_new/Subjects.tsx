import { VStack, useTheme, Heading, Text, Column, Button } from 'native-base';
import { useContext } from 'react';
import { subjects } from '../../../types/lernfair/Subject';
import IconTagList from '../../../widgets/IconTagList';
import TwoColGrid from '../../../widgets/TwoColGrid';
import { RequestMatchContext } from './RequestMatch';

const Subjects: React.FC = () => {
    const { space } = useTheme();
    const { matching, setMatching, setCurrentIndex } = useContext(RequestMatchContext);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Fachauswahl</Heading>
            <Heading>In welchen Fächern brauchst du Hilfe?</Heading>
            {matching.setDazPriority && <Text>Du kannst maximal 1 Fach auswählen.</Text>}
            <TwoColGrid>
                {subjects.map((subject: { label: string; key: string }) => (
                    <Column>
                        <IconTagList
                            iconPath={`subjects/icon_${subject.key}.svg`}
                            initial={matching.subjects.includes(subject)}
                            variant="selection"
                            text={subject.label}
                            onPress={() => {
                                if (!matching.subjects.includes(subject)) {
                                    if (matching.setDazPriority) {
                                        setMatching((prev) => ({
                                            ...prev,
                                            subjects: [subject],
                                        }));
                                    } else {
                                        setMatching((prev) => ({
                                            ...prev,
                                            subjects: [...prev.subjects, subject],
                                        }));
                                    }
                                } else {
                                    var subs = [...matching.subjects];
                                    subs.splice(subs.indexOf(subject), 1);
                                    setMatching((prev) => ({ ...prev, subjects: subs }));
                                }
                            }}
                        />
                    </Column>
                ))}
            </TwoColGrid>
            <Button
                isDisabled={matching.subjects.length === 0}
                onPress={() => setCurrentIndex(4)} // 4 = priorities
            >
                Weiter
            </Button>
            <Button
                variant="outline"
                onPress={() => setCurrentIndex(2)} // 4 = priorities
            >
                Zurück
            </Button>
        </VStack>
    );
};
export default Subjects;
