import { Lecture, Subcourse } from '../../gql/graphql';

export type LFSubCourse = Subcourse;

export type LFLecture = Lecture;

export type LFTag = {
    name: string;
    id: number;
};

export type LFInstructor = {
    id?: number;
    firstname: string;
    lastname: string;
};

export type TrafficStatus = 'full' | 'last' | 'free';
