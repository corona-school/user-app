import { PupilScreening, TutorScreening } from '@/types';

export enum RegistrationStep {
    userType = 'userType',
    acceptanceCheck = 'acceptanceCheck',
    acceptanceCheckFailed = 'acceptanceCheckFailed',
    userName = 'userName',
    userAge = 'userAge',
    languages = 'languages',
    emailOwner = 'emailOwner',
    authenticationInfo = 'authenticationInfo',
    dataPrivacy = 'dataPrivacy',
    confirmEmail = 'confirmEmail',
    bookAppointment = 'bookAppointment',
    screeningAppointmentDetail = 'screeningAppointmentDetail',
    grade = 'grade',
    school = 'school',
    schoolType = 'schoolType',
    zipCode = 'zipCode',
    notifications = 'notifications',
    rules = 'rules',
    registrationCompleted = 'registrationCompleted',

    personalData = 'personalData',
    state = 'state',
    legal = 'legal',
}

export const STUDENT_FLOW = [
    RegistrationStep.userType,
    RegistrationStep.userName,
    RegistrationStep.languages,
    RegistrationStep.authenticationInfo,
    RegistrationStep.dataPrivacy,
    RegistrationStep.confirmEmail,
    RegistrationStep.bookAppointment,
    RegistrationStep.screeningAppointmentDetail,
];

export const PUPIL_FLOW = [
    RegistrationStep.userType,
    RegistrationStep.acceptanceCheck,
    RegistrationStep.userName,
    RegistrationStep.userAge,
    RegistrationStep.languages,
    RegistrationStep.emailOwner,
    RegistrationStep.authenticationInfo,
    RegistrationStep.dataPrivacy,
    RegistrationStep.confirmEmail,
    RegistrationStep.bookAppointment,
    RegistrationStep.screeningAppointmentDetail,
    RegistrationStep.grade,
    RegistrationStep.school,
    RegistrationStep.schoolType,
    RegistrationStep.zipCode,
    RegistrationStep.notifications,
    RegistrationStep.rules,
    RegistrationStep.registrationCompleted,
];

type PupilScreenings = Array<Pick<PupilScreening, 'status'> & { appointment?: any }>;
type StudentScreenings = Array<Pick<TutorScreening, 'status'> & { appointment?: any }>;

export const getPupilScreeningAppointment = (pupilScreenings: PupilScreenings) => {
    const currentBookedScreening = pupilScreenings.find((e) => ['pending', 'dispute'].includes(e.status));
    if (!currentBookedScreening?.appointment) return null;
    return currentBookedScreening.appointment;
};

export const getStudentScreeningAppointment = (instructorScreenings: StudentScreenings, tutorScreenings: StudentScreenings) => {
    const bookedInstructorScreenings = instructorScreenings.find((e) => e.status === 'pending');
    const bookedTutorScreenings = tutorScreenings.find((e) => e.status === 'pending');

    if (bookedInstructorScreenings?.appointment) return bookedInstructorScreenings.appointment;
    if (bookedTutorScreenings?.appointment) return bookedTutorScreenings.appointment;
    return null;
};
