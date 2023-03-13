import { Pupil_Schooltype_Enum } from '../../gql/graphql';
import { LFDecision } from './Decision';
import { LFPupil } from './User';

export type LFCourse = {
    subject: string;
    id?: string;
    name: string;
    description: string;
    tags?: LFTag[];
    image?: string;
    category?: string;
    allowContact?: boolean;
};
export interface LFSubCourse {
    id?: number;
    lectures: LFLecture[];
    image?: string;
    isParticipant?: boolean;
    participants?: LFPupil[];
    participantsAsPupil?: LFPupil[];
    maxParticipants?: number;
    participantsCount?: number;
    course: LFCourse;
    canJoin?: LFDecision;
    isOnWaitingList?: boolean;
    published?: boolean;
    joinAfterStart?: boolean;
    instructors?: LFInstructor[];
    firstLecture?: LFLecture;
    minGrade?: number;
    maxGrade?: number;
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

export type LFPupilOnWaitinglist =
    | {
          id: number;
          firstname: string;
          lastname: string;
          schooltype: Pupil_Schooltype_Enum;
          grade: string;
      }[]
    | undefined;

export type TrafficStatus = 'full' | 'last' | 'free';
