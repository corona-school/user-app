import { PUPIL_FIRST_SCREENING_URL, PUPIL_SCREENING_URL, SCREENING_URL } from '@/config';

interface CreatePupilScreeningLinkArgs {
    isFirstScreening: boolean;
    firstName?: string;
    lastName?: string;
    email?: string;
    grade?: string | null;
    subjects?: { name: string }[];
}

export const createPupilScreeningLink = (data: CreatePupilScreeningLinkArgs) => {
    const baseUrl = data.isFirstScreening ? PUPIL_FIRST_SCREENING_URL : PUPIL_SCREENING_URL;
    const params =
        'first_name=' +
        encodeURIComponent(data.firstName ?? '') +
        '&last_name=' +
        encodeURIComponent(data.lastName ?? '') +
        '&email=' +
        encodeURIComponent(data.email ?? '') +
        '&a1=' +
        encodeURIComponent(data.grade ?? '') +
        '&a2=' +
        encodeURIComponent(data.subjects?.map((it) => it.name).join(', ') ?? '');

    return `${baseUrl}?${params}`;
};

interface CreateStudentScreeningLinkArgs {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export const createStudentScreeningLink = (data: CreateStudentScreeningLinkArgs) => {
    const params =
        'first_name=' +
        encodeURIComponent(data.firstName ?? '') +
        '&last_name=' +
        encodeURIComponent(data.lastName ?? '') +
        '&email=' +
        encodeURIComponent(data.email ?? '');
    return `${SCREENING_URL}?${params}`;
};
