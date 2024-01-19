// eslint-disable-next-line lernfair-app-linter/typed-gql
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Box, Button, CloseIcon, Heading, Modal, Row, Stack, Text, useBreakpointValue, useTheme, useToast, VStack } from 'native-base';
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
import { AppointmentCreateGroupInput } from '../gql/graphql';
import { Appointment } from '../types/lernfair/Appointment';

import { Course_Category_Enum, Course_Subject_Enum } from '../gql/graphql';
import HelpNavigation from '../components/HelpNavigation';
import useApollo from '../hooks/useApollo';

export type CreateCourseError = 'course' | 'subcourse' | 'set_image' | 'upload_image' | 'instructors' | 'lectures' | 'tags' | 'appointments';
export enum ChatType {
    NORMAL = 'NORMAL',
    ANNOUNCEMENT = 'ANNOUNCEMENT',
}

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
    allowProspectContact?: boolean;
    setAllowProspectContact?: Dispatch<SetStateAction<boolean>>;
    allowParticipantContact?: boolean;
    setAllowParticipantContact?: Dispatch<SetStateAction<boolean>>;
    allowChatWritting?: boolean;
    setAllowChatWritting?: Dispatch<SetStateAction<boolean>>;
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
    const { roles } = useApollo();

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
    const [allowProspectContact, setAllowProspectContact] = useState<boolean>(false);
    const [allowParticipantContact, setAllowParticipantContact] = useState<boolean>(true);
    const [allowChatWriting, setAllowChatWriting] = useState<boolean>(false);
    const [lectures, setLectures] = useState<LFLecture[]>([]);
    const [newLectures, setNewLectures] = useState<Lecture[]>([]);
    const [pickedPhoto, setPickedPhoto] = useState<string>('');
    const [addedInstructors, setAddedInstructors] = useState<LFInstructor[]>([]);
    const [newInstructors, setNewInstructors] = useState<LFInstructor[]>([]);
    const [image, setImage] = useState<string>('');
    const [courseAppointments, setCourseAppointments] = useState<Appointment[]>();

    const [isPublished, setIsPublished] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>();
    const [showCourseError, setShowCourseError] = useState<boolean>();

    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const { appointmentsToBeCreated, setAppointmentsToBeCreated } = useCreateCourseAppointments();

    const [currentIndex, setCurrentIndex] = useState<number>(state?.currentStep ? state.currentStep : 0);
    const isEditing = useMemo(() => !!prefillCourseId, [prefillCourseId]);

    const { data: studentData, loading } = useQuery(
        gql(`
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
    `)
    );

    const [courseQuery] = useLazyQuery(
        gql(`
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
                allowChatContactParticipants
                allowChatContactProspects
                groupChatType
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
                appointments {
                    id
                    start
                    duration
                    title
                    description
                    displayName
                    position
                    total
                    appointmentType
                    matchId
                    subcourseId
                    participants(skip: 0, take: 10) {
                        firstname
                        lastname
                      
                    }
                    organizers(skip: 0, take: 10) {
                        firstname
                        lastname
                    }
                }
            }
        }
    `)
    );

    const [createCourse, { reset: resetCourse }] = useMutation(
        gql(`
        mutation createCourse($course: PublicCourseCreateInput!) {
            courseCreate(course: $course) {
                id
            }
        }
    `)
    );
    const [updateCourse, { reset: resetEditCourse }] = useMutation(
        gql(`
        mutation updateCourse($course: PublicCourseEditInput!, $id: Float!) {
            courseEdit(course: $course, courseId: $id) {
                id
            }
        }
    `)
    );
    const [createSubcourse, { reset: resetSubcourse }] = useMutation(
        gql(`
        mutation createSubcourse($courseId: Float!, $subcourse: PublicSubcourseCreateInput!) {
            subcourseCreate(courseId: $courseId, subcourse: $subcourse) {
                id
                canPublish {
                    allowed
                    reason
                }
            }
        }
    `)
    );

    const [createGroupAppointments, { reset: resetAppointments }] = useMutation(
        gql(`
        mutation appointmentsCourseCreate($appointments: [AppointmentCreateGroupInput!]!, $subcourseId: Float!) {
            appointmentsGroupCreate(appointments: $appointments, subcourseId: $subcourseId)
        }
    `)
    );

    const [updateSubcourse, { reset: resetEditSubcourse }] = useMutation(
        gql(`
        mutation updateSubcourse($course: PublicSubcourseEditInput!, $id: Float!) {
            subcourseEdit(subcourse: $course, subcourseId: $id) {
                id
            }
        }
    `)
    );

    const [setCourseImage] = useMutation(
        gql(`
        mutation setCourseImage($courseId: Float!, $fileId: String!) {
            courseSetImage(courseId: $courseId, fileId: $fileId)
        }
    `)
    );

    const [addCourseInstructor] = useMutation(
        gql(`
        mutation addCourseInstructor($studentId: Float!, $courseId: Float!) {
            subcourseAddInstructor(studentId: $studentId, subcourseId: $courseId)
        }
    `)
    );
    const [removeCourseInstructor] = useMutation(
        gql(`
        mutation removeCourseInstructor($studentId: Float!, $courseId: Float!) {
            subcourseDeleteInstructor(studentId: $studentId, subcourseId: $courseId)
        }
    `)
    );

    const [setCourseTags] = useMutation(
        gql(`
        mutation SetCourseTags($courseId: Float!, $courseTagIds: [Float!]!) {
            courseSetTags(courseId: $courseId, courseTagIds: $courseTagIds)
        }
    `)
    );

    const [submitCourse] = useMutation(
        gql(`
        mutation SubmitCourse($courseId: Float!) {
            courseSubmit(courseId: $courseId)
        }
    `)
    );

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
        return () => setAppointmentsToBeCreated([]);
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
        setAllowProspectContact(!!prefillCourse.allowChatContactProspects);
        setAllowParticipantContact(!!prefillCourse.allowChatContactParticipants);
        setAllowChatWriting(prefillCourse.groupChatType === ChatType.NORMAL ? true : false);
        setCourseClasses([prefillCourse.minGrade || 1, prefillCourse.maxGrade || 13]);
        setIsPublished(prefillCourse.published ?? false);
        setCourseAppointments(prefillCourse.appointments ?? []);
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
        if (prefillCourseId != null) queryCourse();
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
        if (courseCategory === Course_Category_Enum.Language) return Course_Subject_Enum.DeutschAlsZweitsprache;
    }, [courseCategory, subject]);

    const _getCourseData = useCallback(
        () => ({
            description,
            schooltype: studentData?.me?.student?.schooltype || 'other',
            outline: '', // keep empty for now, unused
            name: courseName,
            category: courseCategory,
            allowContact: false,
            ...(courseCategory !== Course_Category_Enum.Focus ? { subject: getSubject() } : {}),
        }),
        [courseCategory, courseName, description, studentData?.me?.student?.schooltype, subject]
    );

    const _getSubcourseData = useCallback(() => {
        const subcourse: {
            minGrade: number;
            maxGrade: number;
            maxParticipants: number;
            joinAfterStart: boolean;
            lectures?: LFLecture[];
            allowChatContactProspects: boolean;
            allowChatContactParticipants: boolean;
            groupChatType: ChatType;
        } = {
            minGrade: courseClasses[0],
            maxGrade: courseClasses[1],
            maxParticipants: parseInt(maxParticipantCount),
            joinAfterStart,
            allowChatContactProspects: allowProspectContact,
            allowChatContactParticipants: allowParticipantContact,
            groupChatType: allowChatWriting ? ChatType.NORMAL : ChatType.ANNOUNCEMENT,
        };

        return subcourse;
    }, [allowChatWriting, allowParticipantContact, allowProspectContact, courseClasses, joinAfterStart, maxParticipantCount]);

    const finishCreation = useCallback(
        async (alsoSubmit: boolean) => {
            setIsLoading(true);
            const errors: CreateCourseError[] = [];
            if (appointmentsToBeCreated.length === 0) {
                errors.push('appointments');
                finishCourseCreation(errors);
                return;
            }

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
            subcourse.lectures = [];

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
            const addIdToAppointment = (a: AppointmentCreateGroupInput[], sId: number) => {
                const appointments = a.map((appointment) => ({
                    ...appointment,
                    subcourseId,
                }));
                return appointments;
            };

            const appointments = addIdToAppointment(appointmentsToBeCreated, subcourseId);

            if (appointments.length === 0) {
                errors.push('appointments');
            }

            const appointmentsRes = await createGroupAppointments({ variables: { appointments, subcourseId } });

            setAppointmentsToBeCreated([]);
            if (appointmentsRes.errors) {
                errors.push('appointments');
                await resetAppointments();
                await resetSubcourse();
                await resetCourse();
                finishCourseCreation(errors);
                setIsLoading(false);
                return;
            }

            if (!appointmentsRes.errors) setAppointmentsToBeCreated([]);

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
            appointmentsToBeCreated,
        ]
    );

    const editCourse = useCallback(
        async (newAppointments?: AppointmentCreateGroupInput[]) => {
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

            const subcourseId = subRes?.data?.subcourseEdit?.id;
            /**
             * Appointment Creation
             */
            if (newAppointments && newAppointments?.length > 0) {
                const addIdToAppointment = (a: AppointmentCreateGroupInput[]) => {
                    const appointments = a.map((appointment) => ({
                        ...appointment,
                        subcourseId,
                    }));
                    return appointments;
                };

                const appointments = addIdToAppointment(newAppointments ?? []);

                if (appointments.length === 0) {
                    errors.push('appointments');
                }

                const appointmentsRes = await createGroupAppointments({ variables: { appointments, subcourseId } });

                if (appointmentsRes.errors) {
                    errors.push('appointments');
                    await resetAppointments();
                    await resetSubcourse();
                    await resetCourse();
                    finishCourseCreation(errors);
                    setIsLoading(false);
                    return;
                }

                if (!appointmentsRes.errors) setAppointmentsToBeCreated([]);
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
        },
        [
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
        ]
    );

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
            if (!prefillCourseId) {
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
                headerLeft={
                    <Stack alignItems="center" direction="row">
                        <HelpNavigation />
                        <NotificationAlert />
                    </Stack>
                }
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
                        allowProspectContact,
                        setAllowProspectContact,
                        allowParticipantContact,
                        setAllowParticipantContact,
                        allowChatWritting: allowChatWriting,
                        setAllowChatWritting: setAllowChatWriting,
                        lectures,
                        setLectures,
                        newLectures,
                        setNewLectures,
                        pickedPhoto,
                        setPickedPhoto,
                        addedInstructors,
                        newInstructors,
                        image,
                        myself,
                    }}
                >
                    {(roles.includes('INSTRUCTOR') && studentData?.me?.student?.canCreateCourse?.allowed && (
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
                            {currentIndex === 3 && (
                                <CourseAppointments next={onNext} back={onBack} isEditing={isEditing} appointments={courseAppointments ?? []} />
                            )}
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
                                        courseId={prefillCourseId}
                                        isEditing={isEditing}
                                        isError={showCourseError}
                                        isDisabled={loading || isLoading || imageLoading}
                                        reasonDisabled={t('reasonsDisabled.loading')}
                                        appointments={courseAppointments ?? []}
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
