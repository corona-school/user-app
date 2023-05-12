export type Contact = {
    userID: string;
    talkJsId: string;
    firstname: string;
    lastname: string;
    role: Roles;
    reason: ContactReasons;
};

export type ContactReasons = 'match_partner' | 'course' | 'prospect';
export type Roles = 'student' | 'pupil';

const myContacts: Contact[] = [
    {
        userID: 'student/1',
        talkJsId: 'student_1',
        role: 'student',
        firstname: 'AK',
        lastname: 'typedigital',
        reason: 'match_partner',
    },
    {
        userID: 'pupil/2',
        talkJsId: 'pupil_2',
        role: 'pupil',
        firstname: 'Falko',
        lastname: 'typedigital',
        reason: 'course',
    },
    {
        userID: 'student/3',
        talkJsId: 'student_3',
        role: 'pupil',
        firstname: 'Jenny',
        lastname: 'typedigital',
        reason: 'prospect',
    },
];

export default myContacts;
