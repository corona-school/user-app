import { LFUserType } from '../../types/lernfair/User';

export type Attendee = {
    id: number;
    firstname: string;
    lastname: string;
    userType: LFUserType;
};
