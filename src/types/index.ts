import { Match, Pupil, Pupil_Screening } from '../gql/graphql';

export type Opt<T> = T | null | undefined;

export type MatchWithStudent = Opt<
    Pick<Match, 'createdAt' | 'dissolved' | 'dissolvedAt' | 'pupilFirstMatchRequest' | 'subjectsFormatted'> & {
        student?: { firstname?: Opt<string>; lastname?: Opt<string> };
    }
>;
export type PupilScreening = Opt<Pick<Pupil_Screening, 'id' | 'createdAt' | 'comment' | 'status' | 'invalidated'>>;

export type PupilForScreening = Pick<Pupil, 'firstname' | 'lastname' | 'createdAt'> & { screenings?: PupilScreening[]; matches?: MatchWithStudent[] };
