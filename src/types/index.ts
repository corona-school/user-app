import { Match, Pupil, Pupil_Screening, Screener } from '../gql/graphql';

export type Opt<T> = T | null | undefined;

export type MatchWithStudent = Opt<
    Pick<Match, 'createdAt' | 'dissolved' | 'dissolvedAt' | 'dissolveReasonEnum' | 'dissolvedBy' | 'pupilFirstMatchRequest' | 'subjectsFormatted'> & {
        student?: { firstname?: Opt<string>; lastname?: Opt<string> };
    }
>;
export type PupilScreening = Opt<Pick<Pupil_Screening, 'id' | 'createdAt' | 'updatedAt' | 'comment' | 'status' | 'invalidated'>> & {
    screeners: Pick<Screener, 'firstname' | 'lastname'>[];
};

export type PupilForScreening = Pick<
    Pupil,
    'active' | 'id' | 'firstname' | 'lastname' | 'email' | 'createdAt' | 'subjectsFormatted' | 'languages' | 'grade'
> & {
    screenings?: PupilScreening[];
    matches?: MatchWithStudent[];
};
