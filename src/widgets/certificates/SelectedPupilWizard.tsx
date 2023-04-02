import { DateTime } from 'luxon';
import { Text, useTheme, VStack, Checkbox, Button, Row, Column, Heading } from 'native-base';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from '../../components/DatePicker';
import TextInput from '../../components/TextInput';
import { Match, Pupil, Subject } from '../../gql/graphql';
import { RequestCertificateContext } from '../../pages/RequestCertificate';
import { SubjectSelector } from '../SubjectSelector';
import UserProgress from '../UserProgress';

const isValidNumber = (value: string) => {
    const parsed = parseFloat(value.replace(',', '.'));
    return !isNaN(parsed) && isFinite(parsed);
};

const toValidNumber = (value: string) => (isValidNumber(value) ? parseFloat(value.replace(',', '.')) : null);

const SelectedPupilWizard = ({
    match,
    onNext,
    onPrev,
    currentIndex,
    pupilCount,
}: {
    match: Pick<Match, 'uuid' | 'subjectsFormatted' | 'createdAt'> & { pupil: Pick<Pupil, 'firstname' | 'lastname'> };
    onNext: () => any;
    onPrev: () => any;
    currentIndex: number;
    pupilCount: number;
}) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { state, setState } = useContext(RequestCertificateContext);

    const existingEntry = state.requestData[match.uuid] ?? {};

    const [startDate, setStartDate] = useState<string>(DateTime.fromISO(match.createdAt).toFormat('yyyy-MM-dd'));
    const [endDate, setEndDate] = useState<string>(/* existingEntry.endDate */);
    const [ongoingLessons, setOngoingLessons] = useState<boolean>(existingEntry.ongoingLessons ?? false);
    const [subjects, setSubjects] = useState<string[]>(existingEntry.subjects?.split(',') ?? []);

    const [hoursPerWeek, setHoursPerWeek] = useState<string>('');
    const [hoursTotal, setHoursTotal] = useState<string>('');

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
                    <div className="lf__datepicker">
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                </VStack>
                <VStack space={space['0.5']}>
                    <Text bold>bis zum</Text>
                    <div className="lf__datepicker">
                        <input type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </VStack>

                <Checkbox value={'ongoing'} isChecked={ongoingLessons} onChange={setOngoingLessons}>
                    Unterstützung dauert noch an
                </Checkbox>

                <VStack space={space['0.5']}>
                    <Text bold>Fächer</Text>
                    <SubjectSelector
                        subjects={subjects}
                        selectable={match?.subjectsFormatted.map((it) => it.name) ?? []}
                        addSubject={(it) => setSubjects((prev) => [...prev, it])}
                        removeSubject={(it) => setSubjects((prev) => prev.filter((s) => s !== it))}
                    />
                </VStack>

                <VStack space={space['0.5']}>
                    <Text bold>Zeit</Text>
                    {((hoursPerWeek && !isValidNumber(hoursPerWeek)) || (hoursTotal && !isValidNumber(hoursTotal))) && (
                        <Text color="danger.700">Du musst hier ganze Zahlen eingeben.</Text>
                    )}
                    <Row alignItems="center">
                        <Column flex={0.4}>
                            <TextInput
                                keyboardType="numeric"
                                value={hoursPerWeek}
                                onChangeText={(perWeek) => {
                                    setHoursPerWeek(perWeek);
                                    if (endDate && startDate && isValidNumber(perWeek)) {
                                        const durationInWeeks = DateTime.fromISO(endDate).diff(DateTime.fromISO(startDate), 'weeks').weeks;
                                        setHoursTotal('' + Math.round(toValidNumber(perWeek)! * durationInWeeks));
                                    }
                                }}
                            />
                        </Column>
                        <Text flex="1" ml={space['1']}>
                            Stunden die Woche (durchschnittlich)
                        </Text>
                    </Row>
                    <Row alignItems="center">
                        <Column flex={0.4}>
                            <TextInput keyboardType="numeric" value={hoursTotal} onChangeText={setHoursTotal} />
                        </Column>
                        <Text flex="1" ml={space['1']}>
                            Stunden insgesamt
                        </Text>
                    </Row>
                </VStack>

                <Button
                    isDisabled={
                        !startDate || !endDate || !hoursPerWeek || !hoursTotal || !subjects.length || !isValidNumber(hoursPerWeek) || !isValidNumber(hoursTotal)
                    }
                    onPress={() => {
                        const request = {
                            startDate,
                            endDate,
                            ongoingLessons,
                            hoursPerWeek: toValidNumber(hoursPerWeek)!,
                            hoursTotal: toValidNumber(hoursTotal)!,
                            subjects: subjects.join(', '),
                        };

                        setState((prev) => ({
                            ...prev,
                            requestData: { ...prev.requestData, [match.uuid]: request },
                        }));
                        onNext();
                    }}
                >
                    {currentIndex + 1 < pupilCount ? 'Nächste:r Schüler:in' : t('next')}
                </Button>
                <Button variant="link" onPress={onPrev}>
                    {t('back')}
                </Button>
            </VStack>
        </>
    );
};
export default SelectedPupilWizard;
