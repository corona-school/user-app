import { LFUserType } from '../../types/lernfair/User';

export type Participant = {
    id: number;
    firstname: string;
    lastname: string;
    userType: LFUserType;
};
