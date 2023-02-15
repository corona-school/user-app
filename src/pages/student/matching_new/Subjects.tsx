import { Box, Button, Column, Heading, HStack, Row, useTheme, VStack } from 'native-base';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { RequestMatchContext } from './RequestMatch';
import { SubjectSelector } from '../../../widgets/SubjectSelector';
import { DAZ } from '../../../types/subject';

const Subjects: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { matchRequest, removeSubject, setSubject, setCurrentIndex } = useContext(RequestMatchContext);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Fachauswahl</Heading>
            <Heading>In welchen Fächern möchtest du unterstützen?</Heading>
            <SubjectSelector
                subjects={matchRequest.subjects.filter((it) => it.name !== DAZ).map((it) => it.name)}
                addSubject={(it) => setSubject({ name: it, grade: { min: 1, max: 13 } })}
                removeSubject={removeSubject}
            />
            <Box marginTop={space['0.5']} borderBottomWidth={1} borderBottomColor="primary.grey" />
            <Box alignItems="center" marginTop={space['0.5']}>
                <Row space={space['1']} justifyContent="center">
                    <Column w="100%">
                        <Button h="100%" variant="outline" onPress={() => setCurrentIndex(0)}>
                            {t('lernfair.buttons.prev')}
                        </Button>
                    </Column>
                    <Column w="100%">
                        <Button
                            isDisabled={matchRequest.subjects.length === 0}
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
