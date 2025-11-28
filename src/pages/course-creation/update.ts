import { SUBJECT_TO_COURSE_SUBJECT } from '@/types/subject';
import {
    AppointmentCreateGroupInput,
    AppointmentUpdateInput,
    Course_Subject_Enum,
    CourseCategory,
    PublicCourseCreateInput,
    PublicCourseEditInput,
    PublicSubcourseCreateInput,
    PublicSubcourseEditInput,
} from '@/gql/graphql';
import { LFCourse, LFSubCourse } from '@/types/lernfair/Course';
import { FileItem } from '@/components/Dropzone';
import { Appointment } from '@/types/lernfair/Appointment';
import { useMutation } from '@apollo/client';
import { gql } from '@/gql';
import { BACKEND_URL } from '@/config';

type CourseState = {
    subcourse: Omit<Partial<LFSubCourse>, 'course'>;
    course: Omit<Partial<LFCourse>, 'courseState'>;
    uploadImage?: FileItem | null | undefined; // image to be uploaded; will overwrite `course.image` once uploaded
};

type CourseDelta = CourseState & {
    addedInstructors: number[];
    removedInstructors: number[];
    addedMentors: number[];
    removedMentors: number[];
    changedAppointments: Record<string, any>;
    newAppointments: Appointment[];
    cancelledAppointments: number[]; // IDs of appointments that were cancelled
};

export function getCourseDelta(
    oldState: Partial<CourseState>, // subcourse/course might be null if we're creating a course
    newState: CourseState,
    studentId: number | undefined,
    userType: 'pupil' | 'student' | 'screener'
): CourseDelta {
    const changed = (a: any, b: any) => JSON.stringify(a) !== JSON.stringify(b);

    let delta: CourseDelta = {
        addedInstructors: [],
        addedMentors: [],
        removedInstructors: [],
        removedMentors: [],
        changedAppointments: [],
        cancelledAppointments: [],
        newAppointments: [],
        subcourse: Object.fromEntries(
            Object.entries(newState.subcourse).filter(([k, v]) => !oldState.subcourse || changed(oldState.subcourse[k as keyof Omit<LFSubCourse, 'course'>], v))
        ),
        course: Object.fromEntries(
            Object.entries(newState.course).filter(([k, v]) => !oldState.course || changed(oldState.course[k as keyof Omit<LFCourse, 'courseState'>], v))
        ),
    };

    // Tags
    const prefillTagIds = (oldState?.course?.tags ?? []).map((t) => t.id).sort();
    const stateTagIds = newState.course?.tags?.map((t) => t.id).sort();
    if (changed(prefillTagIds, stateTagIds)) {
        delta.course.tags = newState.course.tags;
    }

    // Instructors
    const prefillInstructorIds = oldState?.subcourse?.instructors ?? [];
    const stateInstructorIds = newState.subcourse.instructors ?? [];

    delta.addedInstructors =
        newState.subcourse.instructors?.filter((i) => i.id !== studentId && !prefillInstructorIds.some((x) => x.id === i.id)).map((i) => i.id) ?? [];
    // don't remove current student as instructor (is removed from instructors when showing course instructors)
    delta.removedInstructors =
        oldState?.subcourse?.instructors?.filter((i) => !stateInstructorIds.some((x) => x.id === i.id) && i.id !== studentId).map((x) => x.id) ?? [];
    // Mentors
    const prefillMentorIds = oldState?.subcourse?.mentors ?? [];
    const stateMentorIds = newState.subcourse.mentors ?? [];

    delta.addedMentors = newState.subcourse.mentors?.filter((i) => !prefillMentorIds.some((x) => x.id === i.id)).map((x) => x.id) ?? [];
    delta.removedMentors = oldState?.subcourse?.mentors?.filter((i) => !stateMentorIds.some((x) => x.id === i.id)).map((x) => x.id) ?? [];

    const existingAppointments: Appointment[] = (userType === 'student' ? oldState?.subcourse?.joinedAppointments : oldState?.subcourse?.appointments) ?? [];
    const prefillMap: Map<number, Appointment> = new Map(existingAppointments.map((a) => [a.id, a]));

    delta.newAppointments = (newState.subcourse.appointments ?? []).filter((a) => !prefillMap.has(a.id));
    const changedAppointments: Record<string, any> = {};
    for (const a of newState.subcourse.appointments ?? []) {
        const prev = prefillMap.get(a.id);
        if (prev && changed(prev, a)) {
            changedAppointments[a.id] = a;
        }
    }
    delta.changedAppointments = changedAppointments;
    // appointments that are not in state but in prefillCourse
    delta.cancelledAppointments = existingAppointments.filter((a) => !newState.subcourse.appointments?.some((x) => x.id === a.id)).map((a) => a.id);

    // Image
    if (newState.uploadImage) {
        delta.uploadImage = newState.uploadImage;
    } else if (newState.course.image !== (oldState?.course?.image ?? '')) {
        delta.course.image = newState.course.image;
    }

    return delta;
}

function objectHasNonUndefinedValues(obj: Record<string, any>): boolean {
    return Object.values(obj).some((value) => value !== undefined);
}

async function uploadImage(image: FileItem): Promise<string> {
    const form = new FormData();
    form.append('file', image.blob);

    const res = await fetch(`${BACKEND_URL}/api/files/upload`, {
        method: 'POST',
        body: form,
    });

    if (!res.ok) {
        throw new Error(`Failed to upload image: ${res.statusText}`);
    }

    return await res.text();
}

export function useUpdateCourse() {
    const [createCourse] = useMutation(
        gql(`
            mutation createCourse($data: PublicCourseCreateInput!) {
                courseCreate(course: $data) { id }
            }
        `)
    );
    const [createSubcourse] = useMutation(
        gql(`
            mutation createSubcourse($data: PublicSubcourseCreateInput!, $courseId: Float!) {
                subcourseCreate(subcourse: $data, courseId: $courseId) { id }
            }
        `)
    );

    const [updateSubcourse] = useMutation(
        gql(`
            mutation updateSubcourse($data: PublicSubcourseEditInput!, $id: Float!) {
                subcourseEdit(subcourse: $data, subcourseId: $id) { id }
            }
        `)
    );

    const [updateCourse] = useMutation(
        gql(`
            mutation updateCourse($data: PublicCourseEditInput!, $id: Float!) {
                courseEdit(course: $data, courseId: $id) { id }
            }
        `)
    );

    const [setTags] = useMutation(
        gql(`
            mutation setCourseTags($courseId: Float!, $tags: [Float!]!) {
                courseSetTags(courseId: $courseId, courseTagIds: $tags)
            }
        `)
    );

    const [setImage] = useMutation(
        gql(`
            mutation setCourseImage($courseId: Float!, $imageId: String!) {
                courseSetImage(courseId: $courseId, fileId: $imageId)
            }
        `)
    );

    const [mutateInstructorsMentors] = useMutation(
        gql(`
            mutation addInstructorToSubcourse($subcourseId: Int!, $addInstructors: [Int!]!, $addMentors: [Int!]!, $removeInstructors: [Int!]!, $removeMentors: [Int!]!) {
                subcourseBulkMutateInstructorsMentors(subcourseId: $subcourseId, 
                    addInstructors: $addInstructors,
                    addMentors: $addMentors,
                    removeInstructors: $removeInstructors,
                    removeMentors: $removeMentors)
            }
        `)
    );

    const [mutateAppointments] = useMutation(
        gql(`
            mutation mutateAppointments($subcourseId: Int!, $createAppointments: [AppointmentCreateGroupInput!]!, $updateAppointments: [AppointmentUpdateInput!]!, $cancelAppointments: [Int!]!) {
                appointmentSubcourseBulkMutate(subcourseId: $subcourseId, createAppointments: $createAppointments, updateAppointments: $updateAppointments, cancelAppointments: $cancelAppointments)
            }
        `)
    );

    return async (
        subcourseId: number | undefined,
        courseId: number | undefined,
        delta: CourseDelta
    ): Promise<{ subcourseId: number; courseId: number } | void> => {
        if (subcourseId === undefined || courseId === undefined) {
            console.log('Creating new course & subcourse');

            const subcourseData: PublicSubcourseCreateInput = {
                joinAfterStart: delta.subcourse.joinAfterStart!,
                minGrade: delta.subcourse.minGrade!,
                maxGrade: delta.subcourse.maxGrade!,
                maxParticipants: delta.subcourse.maxParticipants!,
            };

            const courseData: PublicCourseCreateInput = {
                allowContact: delta.subcourse.allowChatContactParticipants!,
                category: delta.course.category as CourseCategory,
                description: delta.course.description!,
                name: delta.course.name!,
                subject: delta.course.subject ? (SUBJECT_TO_COURSE_SUBJECT as { [key: string]: Course_Subject_Enum })[delta.course.subject!] : undefined,
                outline: '',
            };

            const createCourseRes = await createCourse({
                variables: {
                    data: courseData,
                },
            });
            courseId = createCourseRes.data?.courseCreate.id!;
            const createSubcourseRes = await createSubcourse({
                variables: {
                    data: subcourseData,
                    courseId: courseId!,
                },
            });
            subcourseId = createSubcourseRes.data?.subcourseCreate.id!;
        } else {
            const subcourseData: PublicSubcourseEditInput = {
                joinAfterStart: delta.subcourse.joinAfterStart,
                minGrade: delta.subcourse.minGrade,
                maxGrade: delta.subcourse.maxGrade,
                maxParticipants: delta.subcourse.maxParticipants,
                allowChatContactProspects: delta.subcourse.allowChatContactProspects,
                allowChatContactParticipants: delta.subcourse.allowChatContactParticipants,
            };

            const courseData: PublicCourseEditInput = {
                allowContact: delta.course.allowContact,
                category: delta.course.category ? (delta.course.category! as unknown as CourseCategory) : undefined,
                description: delta.course.description,
                name: delta.course.name,
                subject: delta.course.subject ? (SUBJECT_TO_COURSE_SUBJECT as { [key: string]: Course_Subject_Enum })[delta.course.subject!] : undefined,
            };

            if (objectHasNonUndefinedValues(subcourseData)) {
                await updateSubcourse({ variables: { data: subcourseData, id: subcourseId } });
            }
            if (objectHasNonUndefinedValues(courseData)) {
                await updateCourse({ variables: { data: courseData, id: courseId } });
            }
        }

        if (delta.course.tags) {
            const tagIds = delta.course.tags.map((tag) => tag.id);
            await setTags({ variables: { courseId, tags: tagIds } });
        }

        if (delta.uploadImage) {
            await uploadImage(delta.uploadImage).then((imageId) => setImage({ variables: { courseId: courseId!, imageId } }));
        }

        if (delta.addedInstructors.length > 0 || delta.addedMentors.length > 0 || delta.removedInstructors.length > 0 || delta.removedMentors.length > 0) {
            await mutateInstructorsMentors({
                variables: {
                    subcourseId: subcourseId,
                    addInstructors: delta.addedInstructors,
                    addMentors: delta.addedMentors,
                    removeInstructors: delta.removedInstructors,
                    removeMentors: delta.removedMentors,
                },
            });
        }

        if (delta.newAppointments.length > 0 || delta.cancelledAppointments.length > 0 || Object.entries(delta.changedAppointments).length > 0) {
            const createAppointments: AppointmentCreateGroupInput[] = delta.newAppointments.map((x) => ({
                start: x.start,
                duration: x.duration,
                title: x.title,
                description: x.description,
                appointmentType: x.appointmentType!,
                subcourseId: subcourseId!,
                meetingLink: x.override_meeting_link,
            }));

            const updateAppointments: AppointmentUpdateInput[] = Object.values(delta.changedAppointments).map((x) => ({
                id: x.id,
                start: x.start,
                duration: x.duration,
                title: x.title,
                description: x.description,
                override_meeting_link: x.override_meeting_link,
            }));

            await mutateAppointments({
                variables: {
                    subcourseId,
                    createAppointments,
                    updateAppointments,
                    cancelAppointments: delta.cancelledAppointments,
                },
            });
        }
        return {
            subcourseId: subcourseId!,
            courseId: courseId!,
        };
    };
}
