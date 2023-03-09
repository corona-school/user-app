import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { DateTime } from 'luxon';
import { VStack, useTheme, Heading, Text, Row, Box, Pressable, useBreakpointValue } from 'native-base';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertMessage from '../../widgets/AlertMessage';
import AppointmentInfoRow from '../../widgets/AppointmentInfoRow';

import { CreateCourseContext, Lecture } from '../CreateCourse';
import ButtonRow from './ButtonRow';
import CourseDateWizard from './CourseDateWizard';

type Props = {
    onNext: () => any;
    onBack: () => any;
    onDeleteAppointment: (index: number, isSubmitted: boolean) => any;
};

const CourseAppointments: React.FC<Props> = ({ onNext, onBack, onDeleteAppointment }) => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const { trackPageView } = useMatomo();
    const { newLectures, lectures = [], setNewLectures } = useContext(CreateCourseContext);
    const [newAppointments, setNewAppointments] = useState<Lecture[]>(newLectures || []);

    const [showError, setShowError] = useState<boolean>();
    const [showValidDateMessage, setShowValidDateMessage] = useState<{
        show: boolean;
        index: number;
    }>({ show: false, index: -1 });

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const isValidInput = useMemo(() => {
        if ([...lectures, ...newAppointments].length === 0) return false;

        if (lectures.length === 0) {
            for (let i = 0; i < newAppointments.length; i++) {
                const lec = newAppointments[i];
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
    }, [lectures, newAppointments]);

    const tryNext = useCallback(() => {
        // if (isValidInput) {
        setNewLectures && setNewLectures(newAppointments);
        onNext();
        // } else {
        //     setShowError(true);
        // }
    }, [isValidInput, newAppointments, onNext, setNewLectures]);

    useEffect(() => {
        if (newAppointments?.length === 0) {
            setNewAppointments((prev) => [...prev, { time: '08:00', duration: '', date: '' }]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

            <Heading fontSize="lg">{t('course.appointments.existingAppointments')}</Heading>
            {futureLectures?.map((lec, index) => (
                <AppointmentInfoRow lecture={lec} index={index} key={index} onPressDelete={() => onDeleteAppointment(index, true)} />
            ))}

            <Text fontSize="md" bold>
                {t('course.appointments.content')}
            </Text>

            {newAppointments?.map((lec, i) => (
                <Row maxWidth={ContainerWidth}>
                    {/* <CourseDateWizard
                        index={i}
                        showInvalidDateMessage={showValidDateMessage.show && i === showValidDateMessage.index}
                        onPressDelete={() => {
                            const arr = [...newAppointments];
                            arr.splice(i, 1);
                            setNewAppointments(arr);
                        }}
                    /> */}
                </Row>
            ))}

            <VStack>
                <Pressable
                    marginBottom={space['2']}
                    isDisabled={!isValidInput}
                    onPress={() => {
                        setNewAppointments((prev) => [...prev, { time: '08:00', date: '', duration: '' }]);
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

                {/* {showError && <AlertMessage content={t('course.noticeDate')} />} */}
            </VStack>
            <ButtonRow onNext={tryNext} onBack={onBack} isDisabled={false} />
        </VStack>
    );
};
export default CourseAppointments;
