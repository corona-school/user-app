import { Text, useTheme, VStack, Checkbox, Button, Row, Column, Heading } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../components/DatePicker';
import TextInput from '../../components/TextInput';
import { Subject } from '../../gql/graphql';
import { RequestCertificateContext } from '../../pages/RequestCertificate';
import { LFMatch } from '../../types/lernfair/Match';

import IconTagList from '../IconTagList';
import TwoColGrid from '../TwoColGrid';
import UserProgress from '../UserProgress';

const SelectedPupilWizard = ({
    match,
    onNext,
    onPrev,
    currentIndex,
    pupilCount,
}: {
    match: LFMatch;
    onNext: () => any;
    onPrev: () => any;
    currentIndex: number;
    pupilCount: number;
}) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { setState } = useContext(RequestCertificateContext);

    const [from, setFrom] = useState<string>();
    const [to, setTo] = useState<string>();
    const [ongoing, setOngoing] = useState<boolean>(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject>({
        name: '',
    });
    const [hrsPerWeek, setHrsPerWeek] = useState<string>('');
    const [hrsTotal, setHrsTotal] = useState<string>('');

    const showModal = useCallback(() => {}, []);

    return (
        <>
            <VStack space={space['1']}>
                <Heading>Angaben</Heading>
                <Text>Gebe für jede:n Schüler:in an, in welchem Unfang du sie:ihn unterstützt hast.</Text>

                <VStack>
                    <UserProgress showPercent={false} percent={(currentIndex + 1 / pupilCount) * 100} />
                    <Text fontSize="sm">
                        Schüler:in {currentIndex + 1} von {pupilCount}
                    </Text>
                </VStack>

                <VStack>
                    <Text bold>Schüler:in</Text>
                    <Heading>
                        {match.pupil.firstname} {match.pupil.lastname}
                    </Heading>
                </VStack>

                <VStack space={space['0.5']}>
                    <Text bold>vom Zeitraum</Text>
                    <DatePicker useMin={false} onChange={(e) => setFrom(e.target.value)} />
                </VStack>
                <VStack space={space['0.5']}>
                    <Text bold>bis zum</Text>
                    <DatePicker useMin={false} min={undefined} onChange={(e) => setTo(e.target.value)} />
                </VStack>

                <Checkbox value={'ongoing'} onChange={setOngoing}>
                    Unterstützung dauert noch an
                </Checkbox>

                <VStack space={space['0.5']}>
                    <Text bold>Fächer</Text>
                    <TwoColGrid>
                        {match?.subjectsFormatted?.map((subject) => (
                            <Column mb={space['0.5']}>
                                <IconTagList
                                    initial={selectedSubject.name === subject.name}
                                    variant="selection"
                                    text={subject.name}
                                    iconPath={`subjects/icon_${subject.name}.svg`}
                                    onPress={() => setSelectedSubject(subject)}
                                />
                            </Column>
                        ))}
                        <Column mb={space['0.5']}>
                            <IconTagList initial={false} variant="selection" text="Sonstiges" iconPath={`languages/icon_andere.svg`} onPress={showModal} />
                        </Column>
                    </TwoColGrid>
                    <Heading fontSize="md" mt="-3" mb="3">
                        Sonstiges: Mathematik
                    </Heading>
                </VStack>

                <VStack space={space['0.5']}>
                    <Text bold>Zeit</Text>
                    <Row alignItems="center">
                        <Column flex={0.4}>
                            <TextInput keyboardType="numeric" onChangeText={setHrsPerWeek} />
                        </Column>
                        <Text flex="1" ml={space['1']}>
                            Stunden die Woche (durchschnittlich)
                        </Text>
                    </Row>
                    <Row alignItems="center">
                        <Column flex={0.4}>
                            <TextInput keyboardType="numeric" onChangeText={setHrsTotal} />
                        </Column>
                        <Text flex="1" ml={space['1']}>
                            Stunden insgesamt
                        </Text>
                    </Row>
                </VStack>

                <Button
                    onPress={() => {
                        const pupilData = {
                            from,
                            to,
                            ongoing,
                            hrsPerWeek,
                            hrsTotal,
                            subject: selectedSubject.name,
                        };

                        setState((prev) => ({
                            ...prev,
                            requestData: { ...prev.requestData, [match.pupil.id]: pupilData },
                        }));
                        onNext();
                    }}
                >
                    {currentIndex + 1 < pupilCount ? 'Nächste:r Schüler:in' : t('back')}
                </Button>
                <Button variant="link" onPress={onPrev}>
                    {t('back')}
                </Button>
            </VStack>
        </>
    );
};
export default SelectedPupilWizard;
