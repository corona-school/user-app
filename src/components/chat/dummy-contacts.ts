export type Contact = {
    userID: string;
    talkJsId: string;
    firstname: string;
    lastname: string;
    role: Roles;
    reason: ContactReasons;
    // user: User;
    // chatID: string
    // contactReason: ContactReasons;
};

export type ContactReasons = 'course' | 'match' | 'prospect' | 'participant';
export type Roles = 'student' | 'pupil';

const myContacts: Contact[] = [
    {
        userID: 'student/1',
        talkJsId: 'student_1',
        role: 'student',
        firstname: 'Leon',
        lastname: 'Musterstudent',
        reason: 'match',
    },
    {
        userID: 'pupil/2',
        talkJsId: 'pupil_2',
        role: 'pupil',
        firstname: 'Max',
        lastname: 'Musterschüler:in',
        reason: 'course',
    },
    {
        userID: 'student/3',
        talkJsId: 'student_3',
        role: 'pupil',
        firstname: 'Emma',
        lastname: 'Musterschüler:in',
        reason: 'prospect',
    },
];

export default myContacts;
