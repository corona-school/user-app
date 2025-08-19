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
import { LFInstructor, LFSubCourse, LFTag } from '@/types/lernfair/Course';
import { gql, useLazyQuery } from '@apollo/client';
import CourseDetails from '@/pages/course-creation/CourseDetails';
import { FileItem } from '@/components/Dropzone';
import CourseAppointments from '@/pages/course-creation/CourseAppointments';
import CourseInstructors from '@/pages/course-creation/CourseInstructors';
import { Course_Category_Enum, Course_Subject_Enum, Instructor } from '@/gql/graphql';
import CourseSettings from './course-creation/CourseSettings';
import { Button } from '@/components/Button';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { COURSE_SUBJECT_TO_SUBJECT } from '@/types/subject';
import { getCourseDelta, useUpdateCourse } from './course-creation/update';
import { DisplayAppointment } from '@/widgets/AppointmentList';

export type CreateCourseError =
    | 'course'
    | 'subcourse'
    | 'set_image'
    | 'upload_image'
    | 'instructors'
    | 'lectures'
    | 'tags'
    | 'appointments'
    | 'course-name'
    | 'description'
    | 'category'
    | 'subject'
    | 'grade-range'
    | 'participant-count';

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
                mentors {
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
    const userType = useUserType();
    const location = useLocation();
    const breadcrumbRoutes = useBreadcrumbRoutes();
    const { t } = useTranslation();

    const state = location.state as { subcourseId?: number; currentStep?: number };
    const prefillSubcourseId = state?.subcourseId;
    const [prefillCourse, setPrefillCourse] = useState<LFSubCourse | null>(null); // used for delta calculation
    const isEditing = useMemo(() => !!prefillSubcourseId, [prefillSubcourseId]);

    const [errors, setErrors] = useState<CreateCourseError[]>([]);

    const [courseId, setCourseId] = useState<number | undefined>(undefined);
    const [courseName, setCourseName] = useState<string>('');
    const [courseCategory, setCourseCategory] = useState<Course_Category_Enum>(Course_Category_Enum.Revision);
    const [subject, setSubject] = useState<string | null>(null);
    const [gradeRange, setGradeRange] = useState<[number, number]>([1, 14]);
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<LFTag[]>([]);
    const [maxParticipantCount, setMaxParticipantCount] = useState<number>(50); // default max participants
    const [joinAfterStart, setJoinAfterStart] = useState<boolean>(true);
    const [allowProspectContact, setAllowProspectContact] = useState<boolean>(true);
    const [allowParticipantContact, setAllowParticipantContact] = useState<boolean>(true);
    const [allowChatWriting, setAllowChatWriting] = useState<boolean>(true);
    const [instructors, setInstructors] = useState<LFInstructor[]>([]);
    const [mentors, setMentors] = useState<LFInstructor[]>([]);
    const [image, setImage] = useState<string>('');
    const [pickedPhoto, setPickedPhoto] = useState<FileItem | null | undefined>(undefined); // overrides image if set, used for image upload.
    const [courseAppointments, setCourseAppointments] = useState<DisplayAppointment[]>();
    const [studentId, setStudentId] = useState<number>();

    const [loadingCourse, setLoadingCourse] = useState<boolean>(isEditing);
    const [loadingStudent, setLoadingStudent] = useState<boolean>(false);

    const [courseQuery] = useLazyQuery(COURSE_QUERY);

    const [studentQuery] = useLazyQuery(STUDENT_QUERY);

    const updateCourse = useUpdateCourse();

    const queryStudent = useCallback(async () => {
        const { data } = await studentQuery();
        setStudentId(data.me.student.id);
        setLoadingStudent(false);
    }, [studentQuery]);

    useEffect(() => {
        if (userType === 'student') queryStudent();
    }, [queryStudent]);

    const queryCourse = useCallback(async () => {
        console.log('location.state', location.state, studentId);
        if (!prefillSubcourseId) return;
        if (userType === 'student' && !studentId) return;
        setLoadingCourse(true);
        const {
            data: { subcourse: prefillCourse },
        } = (await courseQuery({
            variables: { id: prefillSubcourseId },
        })) as { data: { subcourse: LFSubCourse } };
        console.log('PREFILLING', prefillCourse);
        setPrefillCourse(prefillCourse);

        setCourseId(prefillCourse.course.id);
        setCourseName(prefillCourse.course.name);
        setSubject(COURSE_SUBJECT_TO_SUBJECT[prefillCourse.course.subject as Course_Subject_Enum]);
        setCourseCategory(prefillCourse.course.category as Course_Category_Enum);
        setDescription(prefillCourse.course.description);
        setMaxParticipantCount(prefillCourse.maxParticipants!);
        setJoinAfterStart(!!prefillCourse.joinAfterStart);
        setAllowProspectContact(!!prefillCourse.allowChatContactProspects);
        setAllowParticipantContact(!!prefillCourse.allowChatContactParticipants);
        setAllowChatWriting(prefillCourse.groupChatType === ChatType.NORMAL);
        setGradeRange([prefillCourse.minGrade || 1, prefillCourse.maxGrade || 14]);
        setCourseAppointments(prefillCourse.appointments ?? []);
        prefillCourse.course.image && setImage(prefillCourse.course.image);

        if (prefillCourse.instructors && Array.isArray(prefillCourse.instructors)) {
            const arr = prefillCourse.instructors.filter((instructor: Instructor) => instructor.id !== studentId);
            setInstructors(arr);
        }

        if (prefillCourse.mentors && Array.isArray(prefillCourse.mentors)) {
            const arr = prefillCourse.mentors.filter((mentor: Instructor) => mentor.id !== studentId);
            setMentors(arr);
        }

        if (prefillCourse.course.tags && Array.isArray(prefillCourse.course.tags)) {
            setTags(prefillCourse.course.tags);
            console.log('Set tags to', prefillCourse.course.tags);
        }

        setLoadingCourse(false);
    }, [courseQuery, prefillSubcourseId, studentId]);

    useEffect(() => {
        if (prefillSubcourseId != null) queryCourse();
    }, [prefillSubcourseId, queryCourse]);

    const submit = async () => {
        const errors: CreateCourseError[] = [];
        if (!courseName || courseName.length < 3) {
            errors.push('course-name');
        }
        if (!description || description.length < 10) {
            errors.push('description');
        }
        if (!courseCategory) {
            errors.push('category');
        }
        if (courseCategory === Course_Category_Enum.Revision && !subject) {
            errors.push('subject');
        }
        if (!gradeRange || gradeRange[0] > gradeRange[1]) {
            errors.push('grade-range');
        }
        if (!maxParticipantCount || maxParticipantCount <= 0) {
            errors.push('participant-count');
        }
        if (errors.length > 0) {
            setErrors(errors);
            return;
        }

        const delta = getCourseDelta(
            prefillCourse ?? {},
            {
                courseName,
                courseCategory,
                subject,
                gradeRange,
                description,
                tags,
                maxParticipantCount: maxParticipantCount,
                joinAfterStart,
                allowProspectContact,
                allowParticipantContact,
                allowChatWriting,
                // instructors does not include the student itself, so we need to add it manually for delta
                instructors: [...instructors.map((x) => x.id!), studentId!],
                mentors: mentors.map((x) => x.id!),
                pickedPhoto,
                image,
                courseAppointments,
            },
            studentId!
        );

        console.log('DELTA', delta);

        const res = await updateCourse(prefillSubcourseId!, courseId, delta);
        if (res && res.subcourseId) {
            setErrors([]);
            // Navigate to the course page after successful creation
            window.location.href = `/single-course/${res.subcourseId}`;
        }
    };

    useEffect(() => {
        if (errors.length > 0) {
            // get element with id "form", search for first element with class "error" and scroll its parent into view
            const formElement = document.getElementById('form');
            if (formElement) {
                const errorElement = formElement.querySelector('.error');
                if (errorElement?.parentElement) {
                    errorElement.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    }, [errors]);

    if (loadingCourse || loadingStudent) {
        return <CenterLoadingSpinner />;
    }

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
                <div className="flex flex-col gap-4 max-w-xl w-full" id="form">
                    <CourseDetails
                        courseName={courseName}
                        setCourseName={setCourseName}
                        description={description}
                        setDescription={setDescription}
                        pickedPhoto={pickedPhoto}
                        setPickedPhoto={setPickedPhoto}
                        existingPhoto={image}
                        maxParticipantCount={maxParticipantCount}
                        setMaxParticipantCount={setMaxParticipantCount}
                        subject={subject}
                        setSubject={setSubject}
                        gradeRange={gradeRange}
                        setGradeRange={setGradeRange}
                        category={courseCategory}
                        setCategory={setCourseCategory}
                        selectedTags={tags}
                        setSelectedTags={setTags}
                        errors={errors}
                    />
                    <CourseInstructors
                        instructors={instructors}
                        mentors={mentors}
                        setInstructors={(x) => setInstructors(x)}
                        setMentors={(x) => setMentors(x)}
                    />
                    <CourseAppointments isEditingCourse={true} appointments={courseAppointments ?? []} setAppointments={setCourseAppointments} />
                    <CourseSettings
                        allowParticipantContact={allowParticipantContact}
                        setAllowParticipantContact={setAllowParticipantContact}
                        allowProspectContact={allowProspectContact}
                        setAllowProspectContact={setAllowProspectContact}
                        allowChatWriting={allowChatWriting}
                        setAllowChatWriting={setAllowChatWriting}
                        joinAfterStart={joinAfterStart}
                        setJoinAfterStart={setJoinAfterStart}
                    />
                    <div className="flex flex-col gap-2">
                        <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
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
            </WithNavigation>
        </>
    );
};

export default CreateCourse;
