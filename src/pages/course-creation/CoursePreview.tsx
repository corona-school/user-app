import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { VStack, Button, useTheme, Heading, Text, Row, Box, Image, useBreakpointValue } from 'native-base';
import { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Tag from '../../components/Tag';
import { useCreateCourseAppointments } from '../../context/AppointmentContext';
import { Appointment, AppointmentTypes } from '../../types/lernfair/Appointment';
import AlertMessage from '../../widgets/AlertMessage';
import AppointmentList from '../../widgets/appointment/AppointmentList';
import { appointmentsData } from '../../widgets/appointment/dummy/testdata';
import IconTagList from '../../widgets/IconTagList';
import { SubjectSelector } from '../../widgets/SubjectSelector';
import { CreateCourseContext } from '../CreateCourse';

type Props = {
    onBack: () => void;
    isDisabled?: boolean;
    isError?: boolean;
    createAndSubmit?: () => void;
    createOnly?: () => void;
    update?: () => void;
};

const CoursePreview: React.FC<Props> = ({ onBack, isDisabled, isError, createAndSubmit, createOnly, update }) => {
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

    const convertTime = useCallback((_time: string) => {
        let time = parseInt(_time);

        return time >= 60 ? time / 60 + ' Stunden' : time + ' Minuten';
    }, []);

    const _convertAppointments = () => {
        let convertedAppointments: Appointment[] = [];
        for (const appointment of appointmentsToBeCreated) {
            const converted = {
                id: 1,
                title: appointment.title,
                description: appointment.description,
                start: appointment.start,
                duration: appointment.duration,
                appointmentType: AppointmentTypes.GROUP,
            };
            convertedAppointments.push(converted);
        }
        return convertedAppointments;
    };

    const _allAppointmentsToShow = () => {
        const convertedAppointments = _convertAppointments();
        const all = appointmentsData.concat(convertedAppointments);
        return all;
    };
    const allAppointmentsToShow = _allAppointmentsToShow();

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
            <Box maxH={maxHeight} flex="1" mb="10">
                <AppointmentList isReadOnly={true} appointments={allAppointmentsToShow} />
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
                            update();
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
