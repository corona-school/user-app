import { Box, Button, Column, Heading, HStack, Row, useTheme, VStack } from 'native-base';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { subjects } from '../../../types/lernfair/Subject';
import IconTagList from '../../../widgets/IconTagList';
import { RequestMatchContext } from './RequestMatch';

const Subjects: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { matching, setMatching, setCurrentIndex } = useContext(RequestMatchContext);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Fachauswahl</Heading>
            <Heading>In welchen Fächern möchtest du unterstützen?</Heading>
            <HStack w="100%" flexWrap="wrap" justifyContent="center" alignItems="center">
                {subjects.map((subject: { label: string; key: string }) => (
                    <Box margin={space['0.5']} maxW="40%" flexBasis="300px" flexGrow={1}>
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
                    </Box>
                ))}
            </HStack>
            <Box alignItems="center">
                <Row space={space['1']} justifyContent="center">
                    <Column w="100%">
                        <Button h="100%" variant="outline" onPress={() => setCurrentIndex(0)}>
                            {t('lernfair.buttons.prev')}
                        </Button>
                    </Column>
                    <Column w="100%">
                        <Button
                            isDisabled={matching.subjects.length === 0}
                            onPress={() => setCurrentIndex(2)} // 2 = german
                        >
                            {t('lernfair.buttons.next')}
                        </Button>
                    </Column>
                </Row>
            </Box>
        </VStack>
    );
};
export default Subjects;
