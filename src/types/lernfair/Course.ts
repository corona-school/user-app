import { Course_Coursestate_Enum } from '../../gql/graphql';
import { Pupil } from '../../gql/graphql';
import { ChatType } from '../../pages/CreateCourse';
import { Appointment } from './Appointment';
import { LFDecision } from './Decision';
import { LFPupil } from './User';

export type LFCourse = {
    subject: string;
    id?: string;
    name: string;
    description: string;
    tags?: LFTag[];
    image?: string;
    category: string;
    allowContact?: boolean;
    courseState?: Course_Coursestate_Enum;
};
export interface LFSubCourse {
    id: number;
    lectures: LFLecture[];
    isParticipant?: boolean;
    participants?: LFPupil[];
    participantsAsPupil?: LFPupil[];
    maxParticipants?: number;
    participantsCount?: number;
    course: LFCourse;
    canJoin?: LFDecision;
    isOnWaitingList?: boolean;
    published?: boolean;
    cancelled?: boolean;
    joinAfterStart?: boolean;
    instructors?: LFInstructor[];
    isInstructor?: boolean;
    firstLecture?: LFLecture;
    minGrade?: number;
    maxGrade?: number;
    allowChatContactProspects?: boolean;
    allowChatContactParticipants?: boolean;
    groupChatType?: ChatType;
    appointments?: Appointment[];
}

export type LFLecture = {
    id?: number;
    start: string;
    duration: number;
};

export type LFTag = {
    name: string;
    id: number;
};

export type LFInstructor = {
    id?: number;
    firstname: string;
    lastname: string;
};

export type LFPupilsOnWaitinglist = PupilOnWaitinglist[] | undefined;

export type PupilOnWaitinglist = Pick<Pupil, 'id' | 'firstname' | 'lastname' | 'schooltype' | 'grade'>;

export type TrafficStatus = 'full' | 'last' | 'free';
