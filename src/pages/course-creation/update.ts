import { COURSE_SUBJECT_TO_SUBJECT, SUBJECT_TO_COURSE_SUBJECT } from '@/types/subject';
import {
    AppointmentCreateGroupInput,
    Course_Category_Enum,
    Course_Subject_Enum,
    CourseCategory,
    PublicCourseCreateInput,
    PublicCourseEditInput,
    PublicSubcourseCreateInput,
    PublicSubcourseEditInput,
} from '@/gql/graphql';
import { ChatType, CreateCourseError } from '../CreateCourse';
import { LFSubCourse, LFTag } from '@/types/lernfair/Course';
import { FileItem } from '@/components/Dropzone';
import { Appointment } from '@/types/lernfair/Appointment';
import { useMutation } from '@apollo/client';
import { gql } from '@/gql';
import { BACKEND_URL } from '@/config';

type CourseDelta = {
    courseName?: string;
    courseCategory?: Course_Category_Enum;
    subject?: string | null;
    gradeRange?: [number, number];
    description?: string;
    tags?: LFTag[];
    maxParticipantCount?: number;
    joinAfterStart?: boolean;
    allowProspectContact?: boolean;
    allowParticipantContact?: boolean;
    allowChatWriting?: boolean;
    addedInstructors: number[];
    removedInstructors: number[];
    addedMentors: number[];
    removedMentors: number[];
    changedAppointments?: Record<string, any>;
    newAppointments: Appointment[];
    cancelledAppointments: number[]; // IDs of appointments that were cancelled
    uploadImage?: FileItem | null; // overrides `image`
    image?: string;
};

export function getCourseDelta(
    prefillCourse: Partial<LFSubCourse> | null,
    state: {
        courseName: string;
        courseCategory: Course_Category_Enum;
        subject: string | null;
        gradeRange: [number, number];
        description: string;
        tags: LFTag[];
        maxParticipantCount: number;
        joinAfterStart: boolean;
        allowProspectContact: boolean;
        allowParticipantContact: boolean;
        allowChatWriting: boolean;
        instructors: number[];
        mentors: number[];
        pickedPhoto: FileItem | null | undefined;
        image: string;
        courseAppointments?: Appointment[];
    },
    studentId: number
): CourseDelta {
    const create = prefillCourse === null;
    const delta: Partial<CourseDelta> = {};

    const changed = (a: any, b: any) => JSON.stringify(a) !== JSON.stringify(b);

    // Simple fields
    if (state.courseName !== prefillCourse?.course?.name || create) delta.courseName = state.courseName;
    if (state.courseCategory !== prefillCourse?.course?.category || create) delta.courseCategory = state.courseCategory;
    if (state.subject !== COURSE_SUBJECT_TO_SUBJECT[prefillCourse?.course?.subject as Course_Subject_Enum] || create) delta.subject = state.subject;
    if (state.description !== prefillCourse?.course?.description || create) delta.description = state.description;
    if (state.maxParticipantCount !== prefillCourse?.maxParticipants || create) delta.maxParticipantCount = state.maxParticipantCount;
    if (state.joinAfterStart !== !!prefillCourse?.joinAfterStart || create) delta.joinAfterStart = state.joinAfterStart;
    if (state.allowProspectContact !== !!prefillCourse?.allowChatContactProspects || create) delta.allowProspectContact = state.allowProspectContact;
    if (state.allowParticipantContact !== !!prefillCourse?.allowChatContactParticipants || create)
        delta.allowParticipantContact = state.allowParticipantContact;
    if (state.allowChatWriting !== (prefillCourse?.groupChatType === ChatType.NORMAL) || create) delta.allowChatWriting = state.allowChatWriting;
    if (state.gradeRange[0] !== prefillCourse?.minGrade || state.gradeRange[1] !== prefillCourse?.maxGrade || create) {
        delta.gradeRange = state.gradeRange;
    }

    // Tags
    const prefillTagIds = (prefillCourse?.course?.tags ?? []).map((t) => t.id).sort();
    const stateTagIds = state.tags.map((t) => t.id).sort();
    if (changed(prefillTagIds, stateTagIds)) {
        delta.tags = state.tags;
    }

    // Instructors
    const prefillInstructorIds = (prefillCourse?.instructors ?? []).map((i) => i);
    const stateInstructorIds = state.instructors.map((i) => i);

    delta.addedInstructors = state.instructors.filter((i) => i !== studentId && !prefillInstructorIds.some((x) => x.id === i));
    delta.removedInstructors = prefillCourse?.instructors?.filter((i) => !stateInstructorIds.includes(i.id)).map((x) => x.id) ?? [];

    // Mentors
    const prefillMentorIds = (prefillCourse?.mentors ?? []).map((i) => i);
    const stateMentorIds = state.mentors.map((i) => i).sort();

    delta.addedMentors = state.mentors.filter((i) => !prefillMentorIds.some((x) => (x.id = i)));
    delta.removedMentors = prefillCourse?.mentors?.filter((i) => !stateMentorIds.includes(i.id)).map((x) => x.id) ?? [];

    const prefillMap = new Map(
        (prefillCourse?.appointments ?? []).map((a) => [
            a.id,
            {
                start: a.start,
                duration: a.duration,
                title: a.title,
                description: a.description,
                displayName: a.displayName,
                position: a.position,
                total: a.total,
                appointmentType: a.appointmentType,
            },
        ])
    );

    const changedAppointments: Record<string, any> = {};
    delta.newAppointments = (state.courseAppointments ?? []).filter((a) => !prefillMap.has(a.id));
    for (const a of state.courseAppointments ?? []) {
        const prev = prefillMap.get(a.id);
        if (
            prev &&
            changed(prev, {
                start: a.start,
                duration: a.duration,
                title: a.title,
                description: a.description,
                displayName: a.displayName,
                position: a.position,
                total: a.total,
                appointmentType: a.appointmentType,
            })
        ) {
            changedAppointments[a.id] = {
                start: a.start,
                duration: a.duration,
                title: a.title,
                description: a.description,
                displayName: a.displayName,
                position: a.position,
                total: a.total,
            };
        }
    }
    delta.changedAppointments = changedAppointments;
    // appointments that are not in state but in prefillCourse
    delta.cancelledAppointments = (prefillCourse?.appointments ?? []).filter((a) => !state.courseAppointments?.some((x) => x.id === a.id)).map((a) => a.id);

    // Image
    if (state.pickedPhoto) {
        delta.uploadImage = state.pickedPhoto;
    } else if (state.image !== (prefillCourse?.course?.image ?? '')) {
        delta.image = state.image;
    }

    return delta as CourseDelta;
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
        _subcourseId: number | undefined,
        _courseId: number | undefined,
        delta: CourseDelta
    ): Promise<{ subcourseId: number; courseId: number } | void> => {
        const promises: Promise<any>[] = [];

        let courseId: number | undefined = _courseId;
        let subcourseId: number | undefined = _subcourseId;

        if (subcourseId === undefined || courseId === undefined) {
            console.log('Creating new course & subcourse');

            const subcourseData: PublicSubcourseCreateInput = {
                joinAfterStart: delta.joinAfterStart!,
                minGrade: delta.gradeRange![0],
                maxGrade: delta.gradeRange![1],
                maxParticipants: delta.maxParticipantCount!,
            };

            const courseData: PublicCourseCreateInput = {
                allowContact: delta.allowParticipantContact!,
                category: delta.courseCategory! as unknown as CourseCategory,
                description: delta.description!,
                name: delta.courseName!,
                subject: delta.subject ? (SUBJECT_TO_COURSE_SUBJECT as { [key: string]: Course_Subject_Enum })[delta.subject!] : undefined,
                outline: '',
            };

            const createCourseRes = await createCourse({
                variables: {
                    data: courseData,
                },
            });
            courseId = createCourseRes.data?.courseCreate.id;
            const createSubcourseRes = await createSubcourse({
                variables: {
                    data: subcourseData,
                    courseId: courseId!,
                },
            });
            subcourseId = createSubcourseRes.data?.subcourseCreate.id;
        } else {
            const subcourseData: PublicSubcourseEditInput = {
                joinAfterStart: delta.joinAfterStart,
                minGrade: delta.gradeRange?.[0],
                maxGrade: delta.gradeRange?.[1],
                maxParticipants: delta.maxParticipantCount,
                allowChatContactProspects: delta.allowProspectContact,
                allowChatContactParticipants: delta.allowParticipantContact, //TODO
            };

            const courseData: PublicCourseEditInput = {
                allowContact: delta.allowParticipantContact, // TODO
                category: delta.courseCategory ? (delta.courseCategory! as unknown as CourseCategory) : undefined,
                description: delta.description,
                name: delta.courseName,
                subject: delta.subject ? (SUBJECT_TO_COURSE_SUBJECT as { [key: string]: Course_Subject_Enum })[delta.subject!] : undefined,
            };

            if (objectHasNonUndefinedValues(subcourseData)) {
                promises.push(updateSubcourse({ variables: { data: subcourseData, id: subcourseId } }));
            }
            if (objectHasNonUndefinedValues(courseData)) {
                promises.push(updateCourse({ variables: { data: courseData, id: courseId } }));
            }
        }

        if (!courseId || !subcourseId) {
            throw new Error('Course or subcourse ID is undefined');
        }

        if (delta.tags) {
            const tagIds = delta.tags.map((tag) => tag.id);
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
            displayName: x.displayName,
            position: x.position,
            total: x.total,
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
