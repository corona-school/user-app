import { useUserType } from '@/hooks/useApollo';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBreadcrumbRoutes } from '@/hooks/useBreadcrumb';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import NotificationAlert from '@/components/notifications/NotificationAlert';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Typography } from '@/components/Typography';
import WithNavigation from '@/components/WithNavigation';
import { useTranslation } from 'react-i18next';
import { LFSubCourse } from '@/types/lernfair/Course';
import { gql } from '@/gql';
import { useLazyQuery, useMutation } from '@apollo/client';
import CourseDetails from '@/pages/course-creation/CourseDetails';
import { FileItem } from '@/components/Dropzone';
import CourseAppointments from '@/pages/course-creation/CourseAppointments';
import { Course_Category_Enum, Course_Coursestate_Enum, Instructor } from '@/gql/graphql';
import CourseSettings from './course-creation/CourseSettings';
import { Button } from '@/components/Button';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
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
    | 'participant-count'
    | 'no-appointments'
    | 'unfinished-appointment';

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
                    courseState
                    tags {
                        id
                        name
                    }
                }
                joinedAppointments(as: organizer) {
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
    const navigate = useNavigate();
    const { t } = useTranslation();

    const state = location.state as { subcourseId?: number; currentStep?: number };
    const prefillSubcourseId = state?.subcourseId;
    const [prefillSubcourse, setPrefillSubcourse] = useState<LFSubCourse | null>(null); // used for delta calculation
    const [updatedSubcourse, setUpdatedSubcourse] = useState<LFSubCourse>({
        id: -1,
        lectures: [],
        course: {
            name: '',
            category: Course_Category_Enum.Revision,
            subject: '',
            description: '',
            allowContact: true,
        },
        maxParticipants: 50,
        allowChatContactParticipants: true,
        allowChatContactProspects: true,
        joinAfterStart: false,
        maxGrade: 14,
        minGrade: 1,
        instructors: [],
        mentors: [],
        groupChatType: ChatType.NORMAL,
    }); // used for delta calculation

    const editingExistingCourse = useMemo(() => !!prefillSubcourseId, [prefillSubcourseId]);

    const [errors, setErrors] = useState<CreateCourseError[]>([]);
    const [appointmentErrors, setAppointmentErrors] = useState<boolean>(false);

    const [courseId, setCourseId] = useState<number | undefined>(undefined);
    const [uploadImage, setUploadImage] = useState<FileItem | null | undefined>(undefined); // overrides image if set, used for image upload.
    const [courseAppointments, setCourseAppointments] = useState<DisplayAppointment[]>();
    const [studentId, setStudentId] = useState<number>();

    const [loadingCourse, setLoadingCourse] = useState<boolean>(editingExistingCourse);
    const [loadingStudent, setLoadingStudent] = useState<boolean>(false);

    const [courseQuery] = useLazyQuery(COURSE_QUERY);

    const [studentQuery] = useLazyQuery(STUDENT_QUERY);

    const [submitCourse] = useMutation(
        gql(`
        mutation CourseSubmit($courseId: Float!) { 
            courseSubmit(courseId: $courseId)
        }
    `)
    );

    const updateCourse = useUpdateCourse();

    const queryStudent = useCallback(async () => {
        const { data } = await studentQuery();
        setStudentId(data?.me?.student?.id);
        setLoadingStudent(false);
    }, [studentQuery]);

    useEffect(() => {
        if (userType === 'student') queryStudent();
    }, [queryStudent, userType]);

    const queryCourse = useCallback(async () => {
        if (!prefillSubcourseId) return;
        if (userType === 'student' && !studentId) return;
        setLoadingCourse(true);
        const {
            data: { subcourse: prefillSubcourse },
        } = (await courseQuery({
            variables: { id: prefillSubcourseId },
        })) as unknown as { data: { subcourse: LFSubCourse } };
        console.log('PREFILLING', prefillSubcourse);
        setPrefillSubcourse(prefillSubcourse);

        setCourseId(prefillSubcourse.course.id);

        let updatedCourse = { ...prefillSubcourse };
        setCourseAppointments((userType === 'student' ? prefillSubcourse.joinedAppointments : prefillSubcourse.appointments) ?? []);

        if (prefillSubcourse.instructors && Array.isArray(prefillSubcourse.instructors)) {
            updatedCourse.instructors = prefillSubcourse.instructors.filter((instructor: Instructor) => instructor.id !== studentId);
        }

        if (prefillSubcourse.mentors && Array.isArray(prefillSubcourse.mentors)) {
            updatedCourse.mentors = prefillSubcourse.mentors.filter((mentor: Instructor) => mentor.id !== studentId);
        }
        setUpdatedSubcourse(updatedCourse);
        setLoadingCourse(false);
    }, [courseQuery, prefillSubcourseId, studentId, userType]);

    useEffect(() => {
        if (prefillSubcourseId != null) queryCourse();
    }, [prefillSubcourseId, queryCourse]);

    const save = async (doSubmit: boolean) => {
        const errors: CreateCourseError[] = [];
        if (!updatedSubcourse?.course.name || updatedSubcourse?.course.name.length < 3) {
            errors.push('course-name');
        }
        if (!updatedSubcourse?.course.description || updatedSubcourse?.course.description.length < 10) {
            errors.push('description');
        }
        if (!updatedSubcourse?.course.category) {
            errors.push('category');
        }
        if (updatedSubcourse?.course.category === Course_Category_Enum.Revision && !updatedSubcourse?.course.subject) {
            errors.push('subject');
        }
        if (
            updatedSubcourse?.course.category !== Course_Category_Enum.Revision &&
            updatedSubcourse?.course.category !== Course_Category_Enum.HomeworkHelp &&
            (!updatedSubcourse?.course.tags || updatedSubcourse?.course.tags!.length === 0)
        ) {
            errors.push('tags');
        }
        if (!updatedSubcourse?.minGrade || !updatedSubcourse?.maxGrade || updatedSubcourse?.minGrade > updatedSubcourse?.maxGrade) {
            errors.push('grade-range');
        }
        if (!updatedSubcourse?.maxParticipants || updatedSubcourse?.maxParticipants <= 0) {
            errors.push('participant-count');
        }
        if (!courseAppointments || courseAppointments?.length === 0) {
            errors.push('no-appointments');
        }
        if (appointmentErrors) {
            errors.push('unfinished-appointment');
        }

        if (errors.length > 0) {
            setErrors(errors);
            return;
        }

        const delta = getCourseDelta(
            {
                course: prefillSubcourse?.course,
                subcourse: prefillSubcourse ?? undefined,
            },
            {
                course: updatedSubcourse?.course!,
                subcourse: { ...updatedSubcourse!, appointments: courseAppointments }, // here we don't need newId anymore
                uploadImage,
            },
            studentId,
            userType
        );

        console.log('DELTA', delta);

        const res = await updateCourse(prefillSubcourseId!, courseId, delta);
        if (res && res.subcourseId) {
            setErrors([]);

            if (doSubmit) {
                await submitCourse({ variables: { courseId: res.courseId } });
            }

            navigate(`/single-course/${res.subcourseId}`, {
                state: {
                    wasEdited: editingExistingCourse,
                },
            });
        }
    };

    useEffect(() => {
        if (errors.length > 0) {
            // get element with id "form", search for first element with class "error" and scroll its parent into view
            const formElement = document.getElementById('form');
            if (formElement) {
                const errorElement = formElement.querySelector('.error');
                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                {editingExistingCourse ? (
                    <Breadcrumb
                        items={[
                            breadcrumbRoutes.COURSES,
                            { label: updatedSubcourse?.course.name!, route: `single-course/${courseId}` },
                            breadcrumbRoutes.EDIT_COURSE,
                        ]}
                    />
                ) : (
                    <Breadcrumb />
                )}
                <Typography variant="h2" className="mb-4">
                    {editingExistingCourse ? t('course.edit') : t('course.header')}
                </Typography>
                <div className="flex flex-col gap-5 w-full sm:max-w-5xl" id="form">
                    <CourseDetails
                        subcourse={updatedSubcourse!}
                        setSubcourse={setUpdatedSubcourse}
                        pickedPhoto={uploadImage}
                        setPickedPhoto={setUploadImage}
                        errors={errors}
                    />
                    <CourseAppointments
                        subcourseId={updatedSubcourse!.id}
                        isEditingCourse={true}
                        errors={errors}
                        setAppointmentErrors={setAppointmentErrors}
                        appointments={courseAppointments ?? []}
                        setAppointments={setCourseAppointments}
                    />
                    <CourseSettings subcourse={updatedSubcourse!} setSubcourse={setUpdatedSubcourse} />
                    <div className="flex flex-col gap-2">
                        <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
                            {t('course.CourseDate.Preview.cancel')}
                        </Button>
                        <Button leftIcon={<IconCheck />} className="w-full" onClick={() => save(false)}>
                            {prefillSubcourse ? t('course.CourseDate.Preview.saveCourse') : t('course.CourseDate.Preview.saveDraft')}
                        </Button>
                        {(!prefillSubcourse || prefillSubcourse?.course?.courseState === Course_Coursestate_Enum.Created) && (
                            <Button variant="secondary" rightIcon={<IconArrowRight />} className="w-full" onClick={() => save(true)}>
                                {t('course.CourseDate.Preview.publishCourse')}
                            </Button>
                        )}
                    </div>
                </div>
            </WithNavigation>
        </>
    );
};

export default CreateCourse;
