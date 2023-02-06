import { VStack, useTheme, Heading, Column, Button } from 'native-base';
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
            <Heading>In welchen Fächern möchtest du unterstützen?</Heading>

            <TwoColGrid>
                {subjects.map((subject: { label: string; key: string }) => (
                    <Column>
                        <IconTagList
                            initial={matching.subjects.includes(subject)}
                            variant="selection"
                            text={subject.label}
                            iconPath={`subjects/icon_${subject.key}.svg`}
                            onPress={() => {
                                if (!matching.subjects.includes(subject)) {
                                    setMatching((prev) => ({
                                        ...prev,
                                        subjects: [...prev.subjects, subject],
                                    }));
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
