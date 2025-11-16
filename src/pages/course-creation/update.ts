import { SUBJECT_TO_COURSE_SUBJECT } from '@/types/subject';
import {
    AppointmentCreateGroupInput,
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
    changedAppointments?: Record<string, any>;
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
    //todo exclude id

    // Tags
    const prefillTagIds = (oldState?.course?.tags ?? []).map((t) => t.id).sort();
    const stateTagIds = newState.course?.tags?.map((t) => t.id).sort();
    if (changed(prefillTagIds, stateTagIds)) {
        delta.course.tags = newState.course.tags;
    }

    // Instructors
    const prefillInstructorIds = (oldState?.subcourse?.instructors ?? []).map((i) => i);
    const stateInstructorIds = newState.subcourse.instructors?.map((i) => i) ?? [];

    delta.addedInstructors =
        newState.subcourse.instructors?.filter((i) => i.id !== studentId && !prefillInstructorIds.some((x) => x.id === i.id)).map((i) => i.id) ?? [];
    delta.removedInstructors = oldState?.subcourse?.instructors?.filter((i) => !stateInstructorIds.some((x) => x.id === i.id)).map((x) => x.id) ?? [];

    // Mentors
    const prefillMentorIds = (oldState?.subcourse?.mentors ?? []).map((i) => i);
    const stateMentorIds = newState.subcourse.mentors?.map((i) => i) ?? [];

    delta.addedMentors = newState.subcourse.mentors?.filter((i) => !prefillMentorIds.some((x) => (x.id = i.id))).map((x) => x.id) ?? [];
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

    const [addInstructor] = useMutation(
        gql(`
            mutation addInstructorToSubcourse($subcourseId: Float!, $instructorId: Float!) {
                subcourseAddInstructor(subcourseId: $subcourseId, studentId: $instructorId)
            }
        `)
    );

    const [removeInstructor] = useMutation(
        gql(`
            mutation removeInstructorFromSubcourse($subcourseId: Float!, $instructorId: Float!) {
                subcourseDeleteInstructor(subcourseId: $subcourseId, studentId: $instructorId)
            }
        `)
    );

    const [addMentor] = useMutation(
        gql(`
            mutation addMentorToSubcourse($subcourseId: Float!, $mentorId: Float!) {
                subcourseAddMentor(subcourseId: $subcourseId, studentId: $mentorId)
            }
        `)
    );

    const [removeMentor] = useMutation(
        gql(`
            mutation removeMentorFromSubcourse($subcourseId: Float!, $mentorId: Float!) {
                subcourseMentorLeave(subcourseId: $subcourseId, studentId: $mentorId)
            }
        `)
    );

    const [updateAppointment] = useMutation(
        gql(`
            mutation updateAppointmentCourse($appointment: AppointmentUpdateInput!) {
                appointmentUpdate(appointmentToBeUpdated: $appointment)
            }
        `)
    );

    const [createAppointments] = useMutation(
        gql(`
            mutation createAppointments($appointments: [AppointmentCreateGroupInput!]!, $subcourseId: Float!) {
                appointmentsGroupCreate(appointments: $appointments, subcourseId: $subcourseId)
            }
        `)
    );

    const [cancelAppointment] = useMutation(
        gql(`
            mutation cancelAppointment($appointmentId: Float!) {
                appointmentCancel(appointmentId: $appointmentId)
            }
        `)
    );

    return async (
        subcourseId: number | undefined,
        courseId: number | undefined,
        delta: CourseDelta
    ): Promise<{ subcourseId: number; courseId: number } | void> => {
        const promises: Promise<any>[] = [];

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
                promises.push(updateSubcourse({ variables: { data: subcourseData, id: subcourseId } }));
            }
            if (objectHasNonUndefinedValues(courseData)) {
                promises.push(updateCourse({ variables: { data: courseData, id: courseId } }));
            }
        }

        if (delta.course.tags) {
            const tagIds = delta.course.tags.map((tag) => tag.id);
            promises.push(setTags({ variables: { courseId, tags: tagIds } }));
        }

        if (delta.uploadImage) {
            promises.push(uploadImage(delta.uploadImage).then((imageId) => setImage({ variables: { courseId: courseId!, imageId } })));
        }

        const removals: Promise<any>[] = [];
        for (const instructor of delta.removedInstructors) {
            removals.push(removeInstructor({ variables: { subcourseId, instructorId: instructor } }));
        }
        for (const mentor of delta.removedMentors) {
            removals.push(removeMentor({ variables: { subcourseId, mentorId: mentor } }));
        }

        // Ensure that we remove the desired people before adding new ones, to avoid race condition
        // to avoid running eagerly, store functions and execute them once removals are done
        const additions: (() => Promise<any>)[] = [];
        for (const instructor of delta.addedInstructors) {
            additions.push(() => addInstructor({ variables: { subcourseId: subcourseId!, instructorId: instructor } }));
        }
        for (const mentor of delta.addedMentors) {
            additions.push(() => addMentor({ variables: { subcourseId: subcourseId!, mentorId: mentor } }));
        }

        promises.push(
            Promise.all(removals).then(async () => {
                return Promise.all(additions.map((add) => add()));
            })
        );

        for (const [id, appointment] of Object.entries(delta.changedAppointments ?? {})) {
            promises.push(updateAppointment({ variables: { appointment: { ...appointment, id: parseInt(id) } } }));
        }
        const appointmentsToCreate: AppointmentCreateGroupInput[] = delta.newAppointments.map((x) => ({
            start: x.start,
            duration: x.duration,
            title: x.title,
            description: x.description,
            appointmentType: x.appointmentType!,
            subcourseId: subcourseId!,
        }));
        if (appointmentsToCreate.length > 0) {
            promises.push(createAppointments({ variables: { appointments: appointmentsToCreate, subcourseId } }));
        }

        for (const appointmentId of delta.cancelledAppointments) {
            promises.push(cancelAppointment({ variables: { appointmentId } }));
        }

        return Promise.all(promises).then(() => {
            return { subcourseId: subcourseId!, courseId: courseId! };
        });
    };
}
