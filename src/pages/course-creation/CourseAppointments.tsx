import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { DateTime } from 'luxon';
import { VStack, useTheme, Heading, Text, Row, Box, Pressable, useBreakpointValue } from 'native-base';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertMessage from '../../widgets/AlertMessage';
import AppointmentInfoRow from '../../widgets/AppointmentInfoRow';
import ButtonRow from './ButtonRow';

import { CreateCourseContext } from '../CreateCourse';
import CourseDateWizard from './CourseDateWizard';

type Props = {
    onNext: () => void;
    onBack: () => void;
    onDeleteAppointment?: (start: string, isSubmitted: boolean) => Promise<void>;
    onlyShowFutureLectures: boolean;
};

const CourseAppointments: React.FC<Props> = ({ onlyShowFutureLectures, onNext, onBack, onDeleteAppointment }) => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const { newLectures = [], lectures = [], setNewLectures } = useContext(CreateCourseContext);
    const [showError, setShowError] = useState<boolean>();
    const [showValidDateMessage, setShowValidDateMessage] = useState<{
        show: boolean;
        index: number;
    }>({ show: false, index: -1 });

    const isValidInput = useMemo(() => {
        if ([...lectures, ...newLectures].length === 0) return false;

        if (lectures.length === 0) {
            for (let i = 0; i < newLectures.length; i++) {
                const lec = newLectures[i];
                if (!lec.date) return false;
                if (!lec.time) return false;
                if (!lec.duration) return false;
                const validDate = DateTime.fromISO(lec.date).diffNow('days').days >= 6;
                !validDate &&
                    setShowValidDateMessage({
                        show: true,
                        index: i,
                    });
                if (!validDate) return false;
            }
        }
        setShowValidDateMessage({
            show: false,
            index: -1,
        });
        return true;
    }, [lectures, newLectures]);

    const tryNext = useCallback(() => {
        if (isValidInput) {
            onNext();
        } else {
            setShowError(true);
        }
    }, [isValidInput, onNext]);

    useEffect(() => {
        if (newLectures?.length === 0) {
            setNewLectures && setNewLectures((prev) => [...prev, { time: '08:00', duration: '', date: '' }]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Kurs erstellen – Termine',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const futureLectures = useMemo(
        () =>
            lectures?.filter((lec) => {
                const date = DateTime.fromISO(lec.start);
                return date.toMillis() > DateTime.now().toMillis();
            }),
        [lectures]
    );

    return (
        <VStack space={space['1']}>
            <Heading marginBottom={space['1.5']}>{t('course.appointments.headline')}</Heading>
            {(onlyShowFutureLectures ? futureLectures : lectures)?.length > 0 && (
                <Heading fontSize="lg"> {t('course.appointments.existingAppointments')}</Heading>
            )}
            {(onlyShowFutureLectures ? futureLectures : lectures)?.map((lec, index) => (
                <AppointmentInfoRow lecture={lec} index={index} key={index} onPressDelete={() => onDeleteAppointment?.(lec.start, true)} />
            ))}

            <Text fontSize="md" bold>
                {t('course.appointments.content')}
            </Text>

            {newLectures?.map((lec, i) => (
                <Row maxWidth={ContainerWidth}>
                    <CourseDateWizard
                        index={i}
                        showInvalidDateMessage={showValidDateMessage.show && i === showValidDateMessage.index}
                        onPressDelete={() => {
                            const arr = [...newLectures];
                            arr.splice(i, 1);
                            setNewLectures && setNewLectures(arr);
                        }}
                    />
                </Row>
            ))}

            <VStack>
                <Pressable
                    marginBottom={space['2']}
                    isDisabled={!isValidInput}
                    onPress={() => {
                        setNewLectures && setNewLectures((prev) => [...prev, { id: prev.length, time: '08:00', date: '', duration: '' }]);
                    }}
                    alignItems="center"
                    flexDirection="row"
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg={!isValidInput ? 'primary.grey' : 'primary.800'}
                        w="40px"
                        h="40px"
                        marginRight="15px"
                        borderRadius="10px"
                    >
                        <Text color="white" fontSize="32px">
                            +
                        </Text>
                    </Box>
                    <Text bold color={!isValidInput ? 'primary.grey' : 'primary.800'}>
                        {t('course.appointments.addOtherAppointment')}
                    </Text>
                </Pressable>

                {showError && <AlertMessage content={t('course.noticeDate')} />}
            </VStack>
            <ButtonRow onNext={tryNext} onBack={onBack} />
        </VStack>
    );
};
export default CourseAppointments;
