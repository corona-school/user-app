import useApollo, { useUserType } from '@/hooks/useApollo';
import { useToast } from 'native-base';
import { useLocation } from 'react-router-dom';
import { useBreadcrumbRoutes } from '@/hooks/useBreadcrumb';
import React, { createContext, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import NotificationAlert from '@/components/notifications/NotificationAlert';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Typography } from '@/components/Typography';
import WithNavigation from '@/components/WithNavigation';
import { useTranslation } from 'react-i18next';
import { LFInstructor, LFLecture, LFSubCourse, LFTag } from '@/types/lernfair/Course';
import { Appointment } from '@/types/lernfair/Appointment';
import { gql, useLazyQuery } from '@apollo/client';
import CourseDetails from '@/pages/course-creation/CourseDetails';
import { FileItem } from '@/components/Dropzone';
import CourseAppointments from '@/pages/course-creation/CourseAppointments';
import CourseInstructors from '@/pages/course-creation/CourseInstructors';
import { Instructor } from '@/gql/graphql';
import CourseSettings from './course-creation/CourseSettings';
import { Button } from '@/components/Button';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import { useCreateCourseAppointments } from '@/context/AppointmentContext';

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
    pickedPhoto?: FileItem | null;
    setPickedPhoto?: Dispatch<SetStateAction<FileItem | null>>;
    addedInstructors?: LFInstructor[];
    setAddedInstructors?: Dispatch<SetStateAction<LFInstructor[]>>;
    newInstructors?: LFInstructor[];
    image?: string;
    myself?: LFInstructor;
};

export const CreateCourseContext = createContext<ICreateCourseContext>({});

const COURSE_QUERY = gql(`
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
                    aboutMe
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
    `);

const STUDENT_QUERY = gql(`
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

const CreateCourse: React.FC = () => {
    const { roles } = useApollo();
    const userType = useUserType();
    const toast = useToast();
    const location = useLocation();
    const breadcrumbRoutes = useBreadcrumbRoutes();
    const { t } = useTranslation();

    const state = location.state as { courseId?: number; currentStep?: number };
    const prefillCourseId = state?.courseId;
    const isEditing = useMemo(() => !!prefillCourseId, [prefillCourseId]);
    const { appointmentsToBeCreated } = useCreateCourseAppointments();

    const [courseId, setCourseId] = useState<string>('');
    const [courseName, setCourseName] = useState<string>('');
    const [courseCategory, setCourseCategory] = useState<string>('');
    const [subject, setSubject] = useState<string | null>(null);
    const [courseClasses, setCourseClasses] = useState<[number, number]>([1, 14]);
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<LFTag[]>([]);
    const [maxParticipantCount, setMaxParticipantCount] = useState<string>('');
    const [joinAfterStart, setJoinAfterStart] = useState<boolean>(false);
    const [allowProspectContact, setAllowProspectContact] = useState<boolean>(false);
    const [allowParticipantContact, setAllowParticipantContact] = useState<boolean>(true);
    const [allowChatWriting, setAllowChatWriting] = useState<boolean>(false);
    const [lectures, setLectures] = useState<LFLecture[]>([]);
    const [newLectures, setNewLectures] = useState<Lecture[]>([]);
    const [pickedPhoto, setPickedPhoto] = useState<FileItem | null>(null);
    const [addedInstructors, setAddedInstructors] = useState<Instructor[]>([]);
    const [newInstructors, setNewInstructors] = useState<Instructor[]>([]);
    const [image, setImage] = useState<string>('');
    const [courseAppointments, setCourseAppointments] = useState<Appointment[]>();
    const [studentMyself, setStudentMyself] = useState<{ firstname: string; lastname: string }>();
    const [studentId, setStudentId] = useState<number>();

    const [loadingCourse, setLoadingCourse] = useState<boolean>(false);
    const [loadingStudent, setLoadingStudent] = useState<boolean>(false);

    const [courseQuery] = useLazyQuery(COURSE_QUERY);

    const [studentQuery] = useLazyQuery(STUDENT_QUERY);

    const queryStudent = useCallback(async () => {
        const { data } = await studentQuery();

        setStudentMyself({
            firstname: data.me.firstname,
            lastname: data.me.lastname,
        });
        // setCanCreateCourse(data.me.student.canCreateCourse);
        setStudentId(data.me.student.id);
        setLoadingStudent(false);
    }, [studentQuery]);

    useEffect(() => {
        if (userType === 'student') queryStudent();
    }, [queryStudent]);

    const queryCourse = useCallback(async () => {
        console.log('location.state', location.state, studentId);
        if (!prefillCourseId) return;
        if (userType === 'student' && !studentId) return;
        console.log('PREFILLING');
        setLoadingCourse(true);
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
        setCourseClasses([prefillCourse.minGrade || 1, prefillCourse.maxGrade || 14]);
        setCourseAppointments(prefillCourse.appointments ?? []);
        console.log('prefillCourse.appointments', prefillCourse.appointments);
        prefillCourse.course.image && setImage(prefillCourse.course.image);

        if (prefillCourse.instructors && Array.isArray(prefillCourse.instructors)) {
            console.log('prefillCourse.instructors', prefillCourse.instructors);
            const arr = prefillCourse.instructors.filter((instructor: Instructor) => instructor.id !== studentId);
            setAddedInstructors(arr);
        }

        if (prefillCourse.course.tags && Array.isArray(prefillCourse.course.tags)) {
            setTags(prefillCourse.course.tags);
        }

        setLoadingCourse(false);
    }, [courseQuery, prefillCourseId, studentId]);

    useEffect(() => {
        if (prefillCourseId != null) queryCourse();
    }, [prefillCourseId, queryCourse]);

    const submit = () => {};

    return (
        <>
            <WithNavigation
                headerTitle={t('appointment.title')}
                previousFallbackRoute="/settings"
                headerLeft={
                    <div className="flex items-center">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </div>
                }
            >
                {isEditing ? (
                    <Breadcrumb items={[breadcrumbRoutes.COURSES, { label: courseName, route: `single-course/${courseId}` }, breadcrumbRoutes.EDIT_COURSE]} />
                ) : (
                    <Breadcrumb />
                )}
                <Typography variant="h2" className="mb-4">
                    {isEditing ? t('course.edit') : t('course.header')}
                </Typography>
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
                        myself: studentMyself,
                    }}
                >
                    <div className="flex flex-col gap-4 max-w-xl w-full">
                        <CourseDetails />
                        <CourseInstructors instructors={addedInstructors} mentors={[]} setInstructors={() => {}} setMentors={() => {}} />
                        <CourseAppointments isEditing={true} appointments={courseAppointments ?? []} />
                        <CourseSettings />
                        <div className="flex flex-col gap-2">
                            <Button variant="outline" className="w-full">
                                Abbrechen
                            </Button>
                            <Button leftIcon={<IconCheck />} className="w-full" onClick={submit}>
                                Entwurf speichern
                            </Button>
                            <Button variant="secondary" rightIcon={<IconArrowRight />} className="w-full">
                                zur Prüfung freigeben
                            </Button>
                        </div>
                    </div>
                </CreateCourseContext.Provider>
            </WithNavigation>
        </>
    );
};

export default CreateCourse;
