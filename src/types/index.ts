import { Match, Pupil, Pupil_Screening } from '../gql/graphql';

export type Opt<T> = T | null | undefined;

export type MatchWithStudent = Opt<
    Pick<Match, 'dissolved' | 'dissolvedAt' | 'pupilFirstMatchRequest' | 'subjectsFormatted'> & {
        student?: { firstname?: Opt<string>; lastname?: Opt<string> };
    }
>;
export type PupilScreening = Opt<Pick<Pupil_Screening, 'createdAt' | 'comment' | 'status' | 'invalidated'>>;

export type PupilForScreening = Pick<Pupil, 'firstname' | 'lastname'> & { screenings?: PupilScreening[]; matches?: MatchWithStudent[] };
