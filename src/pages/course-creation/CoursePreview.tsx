import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { VStack, Button, useTheme, Heading, Text, Row, Box, Image, useBreakpointValue } from 'native-base';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Tag from '../../components/Tag';
import { useCreateCourseAppointments } from '../../context/AppointmentContext';
import { AppointmentCreateGroupInput, Lecture_Appointmenttype_Enum } from '../../gql/graphql';
import { Appointment } from '../../types/lernfair/Appointment';
import AlertMessage from '../../widgets/AlertMessage';
import AppointmentList from '../../widgets/AppointmentList';
import { SubjectSelector } from '../../widgets/SubjectSelector';
import { CreateCourseContext } from '../CreateCourse';
import { DateTime } from 'luxon';
import { useQuery } from '@apollo/client';
import { gql } from '../../gql';

type Props = {
    onBack: () => void;
    isDisabled?: boolean;
    isError?: boolean;
    courseId?: number;
    isEditing?: boolean;
    createAndSubmit?: () => void;
    createOnly?: () => void;
    update?: (newAppointments?: AppointmentCreateGroupInput[]) => void;
    appointments: Appointment[];
};

const CoursePreview: React.FC<Props> = ({ onBack, isDisabled, isError, courseId, appointments, isEditing, createAndSubmit, createOnly, update }) => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const { appointmentsToBeCreated } = useCreateCourseAppointments();
    const {
        courseName,
        subject,
        description,
        maxParticipantCount,
        tags,
        classRange: courseClasses,
        joinAfterStart,
        allowContact,
        pickedPhoto,
    } = useContext(CreateCourseContext);

    const ButtonContainer = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    const ButtonContainerDirection = useBreakpointValue({
        base: 'column',
        lg: 'row',
    });

    const maxHeight = useBreakpointValue({
        base: 400,
        lg: 600,
    });

    const { trackPageView, trackEvent } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Kurs erstellen – Vorschau',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const convertAppointments = () => {
        let convertedAppointments: Appointment[] = [];

        appointmentsToBeCreated.forEach((appointment) => {
            convertedAppointments.push({
                id: 1,
                start: appointment.start,
                duration: appointment.duration,
                appointmentType: Lecture_Appointmenttype_Enum.Group,
                displayName: courseName,
                ...(appointment?.title ? { title: appointment?.title } : { title: '' }),
                ...(appointment?.description ? { description: appointment?.description } : { description: '' }),
            });
        });

        return convertedAppointments;
    };

    const getAllAppointmentsToShow = () => {
        if (isEditing) {
            const convertedAppointments = convertAppointments();
            const allAppointments = appointments.concat(convertedAppointments);
            const sortedAppointments = allAppointments.sort((a, b) => {
                const _a = DateTime.fromISO(a.start).toMillis();
                const _b = DateTime.fromISO(b.start).toMillis();
                return _a - _b;
            });
            let sortedWithPosition: Appointment[] = [];
            sortedAppointments.forEach((appointment, index) => {
                sortedWithPosition.push({ ...appointment, position: index + 1 });
            });
            return sortedWithPosition;
        }
        const newAppointments: Appointment[] = [];
        const convertedAppointments = convertAppointments();
        const allAppointments = newAppointments.concat(convertedAppointments);
        const sortedAppointments = allAppointments.sort((a, b) => {
            const _a = DateTime.fromISO(a.start).toMillis();
            const _b = DateTime.fromISO(b.start).toMillis();
            return _a - _b;
        });

        let sortedWithPosition: Appointment[] = [];
        sortedAppointments.forEach((appointment, index) => {
            sortedWithPosition.push({ ...appointment, position: index + 1 });
        });

        return sortedWithPosition;
    };
    const allAppointmentsToShow = getAllAppointmentsToShow();
    return (
        <VStack space={space['1']}>
            <Heading paddingTop={space['1']}>{t('course.CourseDate.Preview.headline')}</Heading>
            <Text>{t('course.CourseDate.Preview.content')}</Text>
            <Heading>{t('course.CourseDate.Preview.infoHeadline')}</Heading>
            <Row alignItems="end" space={space['0.5']}>
                <Text bold fontSize="md">
                    {t('course.CourseDate.Preview.courseName')}
                </Text>
                <Text fontSize="md">{courseName}</Text>
            </Row>
            <Heading fontSize="md">{t('course.CourseDate.Preview.desc')}</Heading>
            <Text paddingBottom={space['0.5']}>{description}</Text>

            <Row flexDirection="column" paddingBottom={space['0.5']}>
                <Heading fontSize="md" paddingBottom={space['0.5']}>
                    {t('course.CourseDate.Preview.image')}
                </Heading>

                <Box bg="gray.500" h="180">
                    <Image src={pickedPhoto} h="100%" />
                </Box>
            </Row>
            {subject && (
                <>
                    <Heading fontSize="md">{t('course.CourseDate.Preview.courseSubject')}</Heading>
                    <Box paddingBottom={space['0.5']}>
                        <SubjectSelector addSubject={() => {}} removeSubject={() => {}} subjects={[]} selectable={[subject]} variant="normal" />
                    </Box>
                </>
            )}
            {tags && tags?.length > 0 && (
                <>
                    <Heading fontSize="md">{t('course.CourseDate.Preview.tagHeadline')}</Heading>
                    <Row space={space['0.5']}>{(tags && tags.map((t) => <Tag text={t.name} />)) || <Text>{t('course.CourseDate.Preview.notags')}</Text>}</Row>
                </>
            )}

            <Row flexDirection="column" paddingBottom={space['0.5']}>
                <Heading fontSize="md" paddingBottom={space['0.5']}>
                    {t('course.CourseDate.Preview.jahrgangsstufe')}
                </Heading>

                <Text>
                    {t('course.CourseDate.Preview.classHeadline')} {courseClasses && courseClasses[0]} - {courseClasses && courseClasses[1]}
                </Text>
            </Row>

            <VStack>
                <Row>
                    <Text fontSize="md" bold>
                        {t('course.CourseDate.Preview.membersCountLabel') + ' '}
                    </Text>
                    <Text fontSize="md">{t('course.CourseDate.Preview.membersCountMaxLabel', { membersCount: maxParticipantCount })}</Text>
                </Row>

                <Row>
                    <Text fontSize="md" bold>
                        {t('course.CourseDate.Preview.startDateLabel') + ' '}
                    </Text>
                    <Text fontSize="md">{joinAfterStart ? t('course.CourseDate.Preview.yes') : t('course.CourseDate.Preview.no')}</Text>
                </Row>
                <Row marginBottom={space['1']}>
                    <Text fontSize="md" bold>
                        {t('course.CourseDate.Preview.allowContactLabel') + '  '}
                    </Text>
                    <Text fontSize="md">{allowContact ? t('course.CourseDate.Preview.yes') : t('course.CourseDate.Preview.no')}</Text>
                </Row>
            </VStack>
            <Heading fontSize="xl" marginBottom={space['1']}>
                {t('course.CourseDate.Preview.appointmentHeadline')}
            </Heading>
            <Box minH={300} maxH={maxHeight} flex="1" mb="10">
                <AppointmentList isReadOnlyList={true} appointments={allAppointmentsToShow} />
            </Box>
            {isError && (
                <Box mt={space['1']}>
                    <AlertMessage content={t('course.error.course')} />
                </Box>
            )}
            <Row space={space['1']} alignItems="center" flexDirection={ButtonContainerDirection}>
                {update && (
                    <Button
                        marginBottom={space['1']}
                        width={ButtonContainer}
                        onPress={() => {
                            trackEvent({
                                category: 'kurse',
                                action: 'click-event',
                                name: 'Helfer Kurs erstellen – Änderungen Speichern Button',
                                documentTitle: 'Helfer Kurs erstellen',
                            });
                            update(appointmentsToBeCreated);
                        }}
                        isDisabled={isDisabled}
                    >
                        {t('course.CourseDate.Preview.updateCourse')}
                    </Button>
                )}
                {createAndSubmit && (
                    <Button
                        marginBottom={space['1']}
                        width={ButtonContainer}
                        onPress={() => {
                            trackEvent({
                                category: 'kurse',
                                action: 'click-event',
                                name: 'Helfer Kurs erstellen – veröffentlichen Button',
                                documentTitle: 'Helfer Kurs erstellen',
                            });
                            createAndSubmit();
                        }}
                        isDisabled={isDisabled}
                    >
                        {t('course.CourseDate.Preview.publishCourse')}
                    </Button>
                )}
                {createOnly && (
                    <Button
                        marginBottom={space['1']}
                        width={ButtonContainer}
                        onPress={() => {
                            trackEvent({
                                category: 'kurse',
                                action: 'click-event',
                                name: 'Helfer Kurs erstellen – Erstellen Button',
                                documentTitle: 'Helfer Kurs erstellen',
                            });
                            createOnly();
                        }}
                        isDisabled={isDisabled}
                    >
                        {t('course.CourseDate.Preview.saveCourse')}
                    </Button>
                )}
                <Button marginBottom={space['1']} width={ButtonContainer} variant={'outline'} onPress={onBack} isDisabled={isDisabled}>
                    {t('course.CourseDate.Preview.editCourse')}
                </Button>
            </Row>
        </VStack>
    );
};
export default CoursePreview;
