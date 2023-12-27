import { DateTime } from 'luxon';
import { Text, useTheme, VStack, Checkbox, Button, Row, Column, Heading } from 'native-base';
import { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import TextInput from '../../components/TextInput';
import { Match, Pupil } from '../../gql/graphql';
import { RequestCertificateContext } from '../../pages/RequestCertificate';
import { SubjectSelector } from '../SubjectSelector';
import UserProgress from '../UserProgress';
import DisableableButton from '../../components/DisablebleButton';

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
    const [subjects, setSubjects] = useState<string[]>(existingEntry.subjects?.split(',') ?? match?.subjectsFormatted.map((it) => it.name) ?? []);

    const [hoursPerWeek, setHoursPerWeek] = useState<string>('');
    const [hoursTotal, setHoursTotal] = useState<string>('');

    const onPress = () => {
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
    };

    return (
        <>
            <VStack space={space['1']}>
                <Heading>{t('certificate.request_for_match.title')}</Heading>
                <Text>{t('certificate.request_for_match.subtitle')}</Text>

                <VStack>
                    <UserProgress showPercent={false} percent={(currentIndex + 1 / pupilCount) * 100} />
                    <Text fontSize="sm">
                        <Trans i18nKey="certificate.request_for_match.step" values={{ current: currentIndex + 1, total: pupilCount }} />
                    </Text>
                </VStack>

                <VStack>
                    <Text bold>{t('pupil')}</Text>
                    <Heading>
                        {match.pupil.firstname} {match.pupil.lastname}
                    </Heading>
                </VStack>

                <VStack space={space['0.5']}>
                    <Text bold>{t('certificate.request_for_match.from')}</Text>
                    <div className="lf__datepicker">
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                </VStack>
                <VStack space={space['0.5']}>
                    <Text bold>{t('certificate.request_for_match.to')}</Text>
                    <div className="lf__datepicker">
                        <input type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </VStack>

                <Checkbox value={'ongoing'} isChecked={ongoingLessons} onChange={setOngoingLessons}>
                    {t('certificate.request_for_match.continues')}
                </Checkbox>

                <VStack space={space['0.5']}>
                    <Text bold>{t('matching.shared.subjects')}</Text>
                    <SubjectSelector
                        subjects={subjects}
                        addSubject={(it) => setSubjects((prev) => [...prev, it])}
                        removeSubject={(it) => setSubjects((prev) => prev.filter((s) => s !== it))}
                        includeDaz
                    />
                </VStack>

                <VStack space={space['0.5']}>
                    <Text bold>{t('duration')}</Text>
                    {((hoursPerWeek && !isValidNumber(hoursPerWeek)) || (hoursTotal && !isValidNumber(hoursTotal))) && (
                        <Text color="danger.700">{t('certificate.request_for_match.not_a_number')}</Text>
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
                            {t('certificate.request_for_match.hours_per_week')}
                        </Text>
                    </Row>
                    <Row alignItems="center">
                        <Column flex={0.4}>
                            <TextInput keyboardType="numeric" value={hoursTotal} onChangeText={setHoursTotal} />
                        </Column>
                        <Text flex="1" ml={space['1']}>
                            {t('certificate.request_for_match.hours_total')}
                        </Text>
                    </Row>
                </VStack>

                <DisableableButton
                    isDisabled={
                        !startDate || !endDate || !hoursPerWeek || !hoursTotal || !subjects.length || !isValidNumber(hoursPerWeek) || !isValidNumber(hoursTotal)
                    }
                    reasonDisabled={t('reasonsDisabled.formIncomplete')}
                    onPress={onPress}
                >
                    {currentIndex + 1 < pupilCount ? t('certificate.request_for_match.next_pupil') : t('next')}
                </DisableableButton>
                <Button variant="link" onPress={onPrev}>
                    {t('back')}
                </Button>
            </VStack>
        </>
    );
};
export default SelectedPupilWizard;
