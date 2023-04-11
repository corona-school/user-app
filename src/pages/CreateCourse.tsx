import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Box, Button, CloseIcon, Heading, Modal, Row, Text, useBreakpointValue, useTheme, useToast, VStack } from 'native-base';
import { createContext, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import WithNavigation from '../components/WithNavigation';

import InstructionProgress from '../widgets/InstructionProgress';

import CoursePreview from './course-creation/CoursePreview';
import CourseAppointments from './course-creation/CourseAppointments';
import { LFInstructor, LFLecture, LFSubCourse, LFTag } from '../types/lernfair/Course';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import LFParty from '../assets/icons/lernfair/lf-party.svg';
import useModal from '../hooks/useModal';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { GraphQLError } from 'graphql';
import { BACKEND_URL } from '../config';
import { SUBJECT_TO_COURSE_SUBJECT } from '../types/subject';

import CourseBlocker from './student/CourseBlocker';
import AsNavigationItem from '../components/AsNavigationItem';
import CourseBasics from './course-creation/CourseBasics';
import CourseClassification from './course-creation/CourseClassification';
import CourseAttendees from './course-creation/CourseAttendees';
import FurtherInstructors from './course-creation/FurtherInstructors';

import NotificationAlert from '../components/notifications/NotificationAlert';
import { useCreateCourseAppointments } from '../context/AppointmentContext';

import { Course_Category_Enum, Course_Subject_Enum } from '../gql/graphql';

export type CreateCourseError = 'course' | 'subcourse' | 'set_image' | 'upload_image' | 'instructors' | 'lectures' | 'tags' | 'appointments';

export type Lecture = {
    id?: string | number;
    date: string;
    time: string;
    duration: string;
};

type ICreateCourseContext = {
    courseName?: string;
    setCourseName?: Dispatch<SetStateAction<string>>;
    courseCategory?: string;
    setCourseCategory?: Dispatch<SetStateAction<string>>;
    subject?: string | null;
    setSubject?: Dispatch<SetStateAction<string | null>>;
    classRange?: [number, number];
    setClassRange?: Dispatch<SetStateAction<[number, number]>>;
    description?: string;
    setDescription?: Dispatch<SetStateAction<string>>;
    tags?: LFTag[];
    setTags?: Dispatch<SetStateAction<LFTag[]>>;
    maxParticipantCount?: string;
    setMaxParticipantCount?: Dispatch<SetStateAction<string>>;
    joinAfterStart?: boolean;
    setJoinAfterStart?: Dispatch<SetStateAction<boolean>>;
    allowContact?: boolean;
    setAllowContact?: Dispatch<SetStateAction<boolean>>;
    lectures?: LFLecture[];
    setLectures?: Dispatch<SetStateAction<LFLecture[]>>;
    newLectures?: Lecture[];
    setNewLectures?: Dispatch<SetStateAction<Lecture[]>>;
    pickedPhoto?: string;
    setPickedPhoto?: Dispatch<SetStateAction<string>>;
    addedInstructors?: LFInstructor[];
    setAddedInstructors?: Dispatch<SetStateAction<LFInstructor[]>>;
    newInstructors?: LFInstructor[];
    image?: string;
    myself?: LFInstructor;
};

export const CreateCourseContext = createContext<ICreateCourseContext>({});

const CreateCourse: React.FC = () => {
    const toast = useToast();

    const location = useLocation();
    const state = location.state as { courseId?: number; currentStep?: number };
    const prefillCourseId = state?.courseId;

    const [courseId, setCourseId] = useState<string>('');
    const [courseName, setCourseName] = useState<string>('');
    const [courseCategory, setCourseCategory] = useState<string>('');
    const [subject, setSubject] = useState<string | null>(null);
    const [courseClasses, setCourseClasses] = useState<[number, number]>([1, 13]);
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<LFTag[]>([]);
    const [maxParticipantCount, setMaxParticipantCount] = useState<string>('');
    const [joinAfterStart, setJoinAfterStart] = useState<boolean>(false);
    const [allowContact, setAllowContact] = useState<boolean>(false);
    const [pickedPhoto, setPickedPhoto] = useState<string>('');
    const [addedInstructors, setAddedInstructors] = useState<LFInstructor[]>([]);
    const [newInstructors, setNewInstructors] = useState<LFInstructor[]>([]);
    const [image, setImage] = useState<string>('');

    const [isPublished, setIsPublished] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>();
    const [showCourseError, setShowCourseError] = useState<boolean>();

    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const { appointmentsToBeCreated } = useCreateCourseAppointments();

    const [currentIndex, setCurrentIndex] = useState<number>(state?.currentStep ? state.currentStep : 0);
    const isEditing = useMemo(() => !!prefillCourseId, [prefillCourseId]);

    const { data: studentData, loading } = useQuery(gql`
        query StudentCanCreateCourse {
            me {
                student {
                    canCreateCourse {
                        allowed
                        reason
                    }
                    id
                    firstname
                    lastname
                }
            }
        }
    `);

    const [courseQuery] = useLazyQuery(gql`
        query GetSubcourse($id: Int!) {
            subcourse(subcourseId: $id) {
                id
                participantsCount
                maxParticipants
                minGrade
                maxGrade
                published
                instructors {
                    id
                    firstname
                    lastname
                }
                joinAfterStart

                course {
                    id
                    name
                    image
                    category
                    description
                    subject
                    allowContact
                    tags {
                        id
                        name
                    }
                }
            }
        }
    `);

    const [createCourse, { reset: resetCourse }] = useMutation(gql`
        mutation createCourse($course: PublicCourseCreateInput!) {
            courseCreate(course: $course) {
                id
            }
        }
    `);
    const [updateCourse, { reset: resetEditCourse }] = useMutation(gql`
        mutation updateCourse($course: PublicCourseEditInput!, $id: Float!) {
            courseEdit(course: $course, courseId: $id) {
                id
            }
        }
    `);
    const [createSubcourse, { reset: resetSubcourse }] = useMutation(gql`
        mutation createSubcourse($courseId: Float!, $subcourse: PublicSubcourseCreateInput!) {
            subcourseCreate(courseId: $courseId, subcourse: $subcourse) {
                id
                canPublish {
                    allowed
                    reason
                }
            }
        }
    `);
    const [createAppointments, { reset: resetAppointments }] = useMutation(gql`
        mutation createAppointments($appointments: [AppointmentCreateInputFull!]!) {
            appointmentsCreate(appointments: $appointments)
        }
    `);
    const [updateSubcourse, { reset: resetEditSubcourse }] = useMutation(gql`
        mutation updateSubcourse($course: PublicSubcourseEditInput!, $id: Float!) {
            subcourseEdit(subcourse: $course, subcourseId: $id) {
                id
            }
        }
    `);

    const [setCourseImage] = useMutation(gql`
        mutation setCourseImage($courseId: Float!, $fileId: String!) {
            courseSetImage(courseId: $courseId, fileId: $fileId)
        }
    `);

    const [addCourseInstructor] = useMutation(gql`
        mutation addCourseInstructor($studentId: Float!, $courseId: Float!) {
            subcourseAddInstructor(studentId: $studentId, subcourseId: $courseId)
        }
    `);
    const [removeCourseInstructor] = useMutation(gql`
        mutation removeCourseInstructor($studentId: Float!, $courseId: Float!) {
            subcourseDeleteInstructor(studentId: $studentId, subcourseId: $courseId)
        }
    `);

    const [setCourseTags] = useMutation(gql`
        mutation SetCourseTags($courseId: Float!, $courseTagIds: [Float!]!) {
            courseSetTags(courseId: $courseId, courseTagIds: $courseTagIds)
        }
    `);

    const [submitCourse] = useMutation(gql`
        mutation SubmitCourse($courseId: Float!) {
            courseSubmit(courseId: $courseId)
        }
    `);

    const { space, sizes } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const { show, hide } = useModal();
    const { trackPageView } = useMatomo();
    const myself: LFInstructor = {
        firstname: studentData?.me.student.firstname,
        lastname: studentData?.me.student.lastname,
    };

    useEffect(() => {
        trackPageView({
            documentTitle: 'Kurs erstellen',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    const queryCourse = useCallback(async () => {
        if (!prefillCourseId) return;
        if (!studentData?.me.student.id) return;

        setIsLoading(true);
        const {
            data: { subcourse: prefillCourse },
        } = (await courseQuery({
            variables: { id: prefillCourseId },
        })) as { data: { subcourse: LFSubCourse } };

        setCourseId(prefillCourse.course.id || '');
        setCourseName(prefillCourse.course.name);
        setSubject(prefillCourse.course.subject);
        setCourseCategory(prefillCourse.course.category);
        setDescription(prefillCourse.course.description);
        setMaxParticipantCount(prefillCourse.maxParticipants?.toString() || '0');
        setJoinAfterStart(!!prefillCourse.joinAfterStart);
        setAllowContact(!!prefillCourse.course.allowContact);
        setCourseClasses([prefillCourse.minGrade || 1, prefillCourse.maxGrade || 13]);
        setIsPublished(prefillCourse.published ?? false);
        prefillCourse.course.image && setImage(prefillCourse.course.image);

        if (prefillCourse.instructors && Array.isArray(prefillCourse.instructors)) {
            const arr = prefillCourse.instructors.filter((instructor: LFInstructor) => instructor.id !== studentData.me.student.id);
            setAddedInstructors(arr);
        }

        if (prefillCourse.course.tags && Array.isArray(prefillCourse.course.tags)) {
            setTags(prefillCourse.course.tags);
        }

        setIsLoading(false);
    }, [courseQuery, prefillCourseId, studentData?.me.student.id]);

    useEffect(() => {
        if (prefillCourseId !== null) queryCourse();
    }, [prefillCourseId, queryCourse]);

    const finishCourseCreation = useCallback(
        (errors: any[]) => {
            setIsLoading(false);

            if (errors.includes('course') || errors.includes('subcourse') || errors.includes('appointments')) {
                setShowCourseError(true);
            } else {
                navigate('/group', {
                    state: {
                        wasEdited: isEditing,
                        errors,
                    },
                });
            }
        },
        [isEditing, navigate]
    );

    const getSubject = useCallback(() => {
        if (courseCategory === Course_Category_Enum.Revision) return (SUBJECT_TO_COURSE_SUBJECT as any)[subject!];
        if (courseCategory === Course_Category_Enum.Language) return Course_Subject_Enum.Deutsch;
    }, [courseCategory, subject]);

    const _getCourseData = useCallback(
        () => ({
            description,
            schooltype: studentData?.me?.student?.schooltype || 'other',
            outline: '', // keep empty for now, unused
            name: courseName,
            category: courseCategory,
            allowContact,
            ...(courseCategory !== Course_Category_Enum.Focus ? { subject: getSubject() } : {}),
        }),
        [allowContact, courseCategory, courseName, description, studentData?.me?.student?.schooltype, subject]
    );

    const _getSubcourseData = useCallback(() => {
        const subcourse: {
            minGrade: number;
            maxGrade: number;
            maxParticipants: number;
            joinAfterStart: boolean;
        } = {
            minGrade: courseClasses[0],
            maxGrade: courseClasses[1],
            maxParticipants: parseInt(maxParticipantCount),
            joinAfterStart,
        };

        return subcourse;
    }, [courseClasses, joinAfterStart, maxParticipantCount]);

    const finishCreation = useCallback(
        async (alsoSubmit: boolean) => {
            setIsLoading(true);

            const errors: CreateCourseError[] = [];

            /**
             * Course Creation
             */
            const course = _getCourseData();
            const courseData = (await createCourse({
                variables: {
                    course,
                },
            })) as { data: { courseCreate?: { id: number } }; errors?: GraphQLError[] };

            if (!courseData.data && courseData.errors) {
                errors.push('course');
                await resetCourse();
                finishCourseCreation(errors);
                return;
            }

            const courseId = courseData?.data?.courseCreate?.id;

            if (!courseId) {
                errors.push('course');
                await resetCourse();
                finishCourseCreation(errors);
                setIsLoading(false);
                return;
            }
            const tagIds = tags.map((t: LFTag) => t.id);
            const tagsRes = await setCourseTags({
                variables: { courseTagIds: tagIds, courseId },
            });
            if (!tagsRes.data.courseSetTags && tagsRes.errors) {
                errors.push('tags');
            }

            if (alsoSubmit) {
                await submitCourse({ variables: { courseId } });
            }
            /**
             * Subcourse Creation
             */
            const subcourse = _getSubcourseData();

            const subRes = await createSubcourse({
                variables: {
                    courseId: courseId,
                    subcourse,
                },
            });

            const subcourseId = subRes?.data?.subcourseCreate?.id;

            if (!subRes.data && subRes.errors) {
                errors.push('subcourse');
                await resetSubcourse();
                await resetCourse();
                finishCourseCreation(errors);
                setIsLoading(false);
                return;
            }

            if (subRes.data.subcourseCreate && !subRes.errors) {
                for await (const instructor of addedInstructors) {
                    let res = await addCourseInstructor({
                        variables: {
                            courseId: subRes.data?.subcourseCreate?.id,
                            studentId: instructor.id,
                        },
                    });
                    if (!res.data && res.errors) {
                        errors.push('instructors');
                    }
                }
            }

            /**
             * Appointment Creation
             */
            const courseAppointmentsToBeCreatedWithSubcourseId = appointmentsToBeCreated.forEach((appointment) => {
                appointment.subcourseId = subcourseId;
            });

            const appointmentsRes = await createAppointments({
                variables: {
                    courseAppointmentsToBeCreatedWithSubcourseId,
                },
            });

            if (!appointmentsRes.data && appointmentsRes.errors) {
                errors.push('appointments');
                await resetAppointments();
                await resetSubcourse();
                await resetCourse();
                finishCourseCreation(errors);
                setIsLoading(false);
                return;
            }

            /**
             * Image upload
             */
            if (!pickedPhoto) {
                finishCourseCreation(errors);
                return;
            }
            setImageLoading(true);
            const formData: FormData = new FormData();

            const base64 = pickedPhoto ? await fetch(pickedPhoto) : require('../assets/images/globals/image-placeholder.png');
            const data = await base64.blob();
            formData.append('file', data, 'img_course.jpeg');

            let uploadFileId;
            try {
                uploadFileId = await (
                    await fetch(BACKEND_URL + '/api/files/upload', {
                        method: 'POST',
                        body: formData,
                    })
                ).text();

                if (!uploadFileId) {
                    errors.push('upload_image');
                }
            } catch (e) {
                console.error(e);
                errors.push('upload_image');
            }

            if (!uploadFileId) {
                finishCourseCreation(errors);
                return;
            }

            /**
             * Set image in course
             */
            const imageRes = (await setCourseImage({
                variables: {
                    courseId: courseId,
                    fileId: uploadFileId,
                },
            })) as { data?: { setCourseImage: boolean }; errors?: GraphQLError[] };

            if (!imageRes.data && imageRes.errors) {
                errors.push('set_image');
            }

            setImageLoading(false);

            finishCourseCreation(errors);
        },
        [
            _getCourseData,
            _getSubcourseData,
            addCourseInstructor,
            addedInstructors,
            createCourse,
            createSubcourse,
            finishCourseCreation,
            pickedPhoto,
            resetCourse,
            resetSubcourse,
            setCourseImage,
            setCourseTags,
            tags,
        ]
    );

    const editCourse = useCallback(async () => {
        setIsLoading(true);
        const errors: CreateCourseError[] = [];

        const course = _getCourseData();
        const courseData = (await updateCourse({
            variables: {
                course,
                id: courseId,
            },
        })) as { data: { courseEdit?: { id: number } }; errors?: GraphQLError[] };

        if (!courseData.data && courseData.errors) {
            errors.push('course');
            await resetEditCourse();
            finishCourseCreation(errors);
            return;
        }

        const _courseId = courseData?.data?.courseEdit?.id;

        if (!_courseId) {
            errors.push('course');
            await resetEditCourse();
            finishCourseCreation(errors);
            setIsLoading(false);
            return;
        }

        const tagIds = tags.map((t: LFTag) => t.id);
        const tagsRes = await setCourseTags({
            variables: { courseTagIds: tagIds, courseId },
        });
        if (!tagsRes.data.courseSetTags && tagsRes.errors) {
            errors.push('tags');
        }

        const subcourse = _getSubcourseData();
        const subRes = await updateSubcourse({
            variables: {
                id: prefillCourseId,
                course: subcourse,
            },
        });

        if (!subRes.data && subRes.errors) {
            errors.push('subcourse');
            await resetEditSubcourse();
            await resetEditCourse();
            finishCourseCreation(errors);
            setIsLoading(false);
            return;
        }

        for await (const instructor of newInstructors) {
            let res = await addCourseInstructor({
                variables: {
                    courseId: prefillCourseId,
                    studentId: instructor.id,
                },
            });
            if (!res.data && res.errors) {
                errors.push('instructors');
            }
        }

        /**
         * Image upload
         */
        if (!pickedPhoto) {
            setIsLoading(false);
            finishCourseCreation(errors);
            return;
        }
        setImageLoading(true);
        const formData: FormData = new FormData();

        const base64 = await fetch(pickedPhoto);

        const data = await base64.blob();
        formData.append('file', data, 'img_course.jpeg');

        let uploadFileId;
        try {
            uploadFileId = await (
                await fetch(BACKEND_URL + '/api/files/upload', {
                    method: 'POST',
                    body: formData,
                })
            ).text();

            if (!uploadFileId) {
                errors.push('upload_image');
            }
        } catch (e) {
            console.error(e);
            errors.push('upload_image');
        }

        if (!uploadFileId) {
            finishCourseCreation(errors);
            return;
        }

        /**
         * Set image in course
         */
        const imageRes = (await setCourseImage({
            variables: {
                courseId: courseId,
                fileId: uploadFileId,
            },
        })) as { data?: { setCourseImage: boolean }; errors?: GraphQLError[] };

        if (!imageRes.data && imageRes.errors) {
            errors.push('set_image');
        }

        setImageLoading(false);
        finishCourseCreation(errors);
    }, [
        _getCourseData,
        updateCourse,
        courseId,
        tags,
        setCourseTags,
        _getSubcourseData,
        updateSubcourse,
        prefillCourseId,
        pickedPhoto,
        setCourseImage,
        finishCourseCreation,
        resetEditCourse,
        resetEditSubcourse,
        newInstructors,
        addCourseInstructor,
    ]);

    const onNext = useCallback(() => {
        if (currentIndex >= 6) {
            return;
        } else {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex]);

    const onBack = useCallback(() => {
        setCurrentIndex((prev) => prev - 1);
    }, []);

    const onCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const addInstructor = useCallback(
        (instructor: LFInstructor) => {
            if (prefillCourseId === null) {
                if (addedInstructors.findIndex((i) => i.id === instructor.id) === -1) {
                    setAddedInstructors((prev) => [...prev, instructor]);
                }
            } else {
                if (newInstructors.findIndex((i) => i.id === instructor.id) === -1) {
                    setNewInstructors((prev) => [...prev, instructor]);
                }
            }
            hide();
        },
        [addedInstructors, newInstructors, prefillCourseId, hide]
    );

    const removeInstructor = useCallback(
        async (index: number, isSubmitted: boolean) => {
            if (!isSubmitted) {
                const arr = [...newInstructors];
                arr.splice(index, 1);
                setNewInstructors(arr);
            } else {
                const res = await removeCourseInstructor({
                    variables: {
                        courseId: prefillCourseId,
                        studentId: addedInstructors[index].id,
                    },
                });

                if (res.data.subcourseDeleteInstructor && !res.errors) {
                    const arr = [...addedInstructors];
                    arr.splice(index, 1);
                    setAddedInstructors(arr);
                    toast.show({ description: 'Der/Die Kursleiter:in wurde entfernt.', placement: 'top' });
                } else {
                    toast.show({
                        description: 'Der/Die Kursleiter:in konnte nicht entfernt werden.',
                        placement: 'top',
                    });
                }
            }
        },
        [addedInstructors, newInstructors, prefillCourseId, removeCourseInstructor, toast]
    );

    const goToStep = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    return (
        <AsNavigationItem path="group">
            <WithNavigation
                headerTitle={isEditing ? t('course.edit') : t('course.header')}
                showBack
                isLoading={loading || isLoading}
                headerLeft={<NotificationAlert />}
            >
                <CreateCourseContext.Provider
                    value={{
                        courseName,
                        setCourseName,
                        courseCategory,
                        setCourseCategory,
                        classRange: courseClasses,
                        setClassRange: setCourseClasses,
                        subject,
                        setSubject,
                        description,
                        setDescription,
                        tags,
                        setTags,
                        maxParticipantCount,
                        setMaxParticipantCount,
                        joinAfterStart,
                        setJoinAfterStart,
                        allowContact,
                        setAllowContact,
                        pickedPhoto,
                        setPickedPhoto,
                        addedInstructors,
                        newInstructors,
                        image,
                        myself,
                    }}
                >
                    {(studentData?.me?.student?.canCreateCourse?.allowed && (
                        <VStack space={space['1']} padding={space['1']} marginX="auto" width="100%" maxWidth={ContentContainerWidth}>
                            <InstructionProgress
                                isDark={false}
                                currentIndex={currentIndex}
                                goToStep={goToStep}
                                instructions={[
                                    {
                                        label: t('course.CourseDate.step.general'),
                                    },
                                    {
                                        label: t('course.CourseDate.step.subject'),
                                    },
                                    {
                                        label: t('course.CourseDate.step.attendees'),
                                    },
                                    {
                                        label: t('course.CourseDate.step.appointments'),
                                    },
                                    {
                                        label: t('course.CourseDate.step.settings'),
                                    },
                                    {
                                        label: t('course.CourseDate.step.checker'),
                                    },
                                ]}
                            />
                            {currentIndex === 0 && <CourseBasics onCancel={onCancel} onNext={onNext} />}
                            {currentIndex === 1 && <CourseClassification onNext={onNext} onBack={onBack} />}
                            {currentIndex === 2 && <CourseAttendees onNext={onNext} onBack={onBack} />}
                            {currentIndex === 3 && <CourseAppointments next={onNext} back={onBack} />}
                            {currentIndex === 4 && (
                                <FurtherInstructors onRemove={removeInstructor} addInstructor={addInstructor} onNext={onNext} onBack={onBack} />
                            )}
                            {currentIndex === 5 && (
                                <>
                                    <CoursePreview
                                        createAndSubmit={prefillCourseId ? undefined : () => finishCreation(/* also submit */ true)}
                                        createOnly={prefillCourseId ? undefined : () => finishCreation(/* also submit */ false)}
                                        update={prefillCourseId ? editCourse : undefined}
                                        onBack={onBack}
                                        isError={showCourseError}
                                        isDisabled={loading || isLoading || imageLoading}
                                    />
                                    <Modal isOpen={showModal} onClose={() => setShowModal(false)} background="modalbg">
                                        <Modal.Content width="307px" marginX="auto" backgroundColor="transparent">
                                            <Box position="absolute" zIndex="1" right="20px" top="14px">
                                                <Pressable onPress={() => setShowModal(false)}>
                                                    <CloseIcon color="white" />
                                                </Pressable>
                                            </Box>
                                            <Modal.Body background="primary.900" padding={space['1']}>
                                                <Box alignItems="center" marginY={space['1']}>
                                                    <LFParty />
                                                </Box>
                                                <Box paddingY={space['1']}>
                                                    <Heading maxWidth="330px" marginX="auto" textAlign="center" color="lightText" marginBottom={space['0.5']}>
                                                        {t('course.CourseDate.modal.headline')}
                                                    </Heading>
                                                    <Text textAlign="center" color="lightText" maxWidth="330px" marginX="auto">
                                                        {t('course.CourseDate.modal.content')}
                                                    </Text>
                                                </Box>
                                                <Box paddingY={space['1']}>
                                                    <Row marginBottom={space['0.5']}>
                                                        <Button onPress={() => navigate('/')} width="100%">
                                                            {t('next')}
                                                        </Button>
                                                    </Row>
                                                </Box>
                                            </Modal.Body>
                                        </Modal.Content>
                                    </Modal>
                                </>
                            )}
                        </VStack>
                    )) || <CourseBlocker />}
                </CreateCourseContext.Provider>
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default CreateCourse;
