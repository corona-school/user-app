import {
    Certificate_Of_Conduct,
    Course,
    Course_Tag,
    Instructor_Screening,
    Lecture,
    Match,
    Pupil,
    Pupil_Screening,
    Screener,
    Screening,
    Student,
    Subcourse,
} from '../gql/graphql';

export type Opt<T> = T | null | undefined;

export type MatchWithStudent = Opt<
    Pick<Match, 'createdAt' | 'dissolved' | 'dissolvedAt' | 'dissolveReasons' | 'dissolvedBy' | 'pupilFirstMatchRequest' | 'subjectsFormatted'> & {
        student?: { firstname?: Opt<string>; lastname?: Opt<string> };
    }
>;

export type MatchWithPupil = Opt<
    Pick<Match, 'createdAt' | 'dissolved' | 'dissolvedAt' | 'dissolveReasons' | 'dissolvedBy' | 'pupilFirstMatchRequest' | 'subjectsFormatted'> & {
        pupil?: { firstname?: Opt<string>; lastname?: Opt<string> };
    }
>;

export type PupilScreening = Opt<Pick<Pupil_Screening, 'id' | 'createdAt' | 'updatedAt' | 'comment' | 'status' | 'invalidated' | 'knowsCoronaSchoolFrom'>> & {
    screeners: Pick<Screener, 'firstname' | 'lastname'>[];
};

export type PupilForScreening = Pick<
    Pupil,
    | 'active'
    | 'id'
    | 'firstname'
    | 'lastname'
    | 'email'
    | 'createdAt'
    | 'subjectsFormatted'
    | 'languages'
    | 'grade'
    | 'gradeAsInt'
    | 'openMatchRequestCount'
    | 'verifiedAt'
    | 'state'
    | 'schooltype'
    | 'onlyMatchWith'
    | 'hasSpecialNeeds'
    | 'descriptionForMatch'
    | 'descriptionForScreening'
> & {
    screenings?: PupilScreening[];
    matches?: MatchWithStudent[];
};

export type InstructorScreening = Pick<Instructor_Screening, 'id' | 'success' | 'createdAt' | 'comment'> & {
    screener: Pick<Screener, 'firstname' | 'lastname'>;
};

export type TutorScreening = Pick<Screening, 'id' | 'createdAt' | 'success' | 'comment'> & { screener: Pick<Screener, 'firstname' | 'lastname'> };

export type SubcourseForScreening = Pick<Subcourse, 'id' | 'published'> & {
    course: Pick<Course, 'name' | 'image'> & { tags: Pick<Course_Tag, 'name'>[] };
    nextLecture?: Opt<Pick<Lecture, 'start' | 'duration'>>;
};

export type StudentForScreening = Pick<
    Student,
    | 'active'
    | 'id'
    | 'email'
    | 'firstname'
    | 'lastname'
    | 'createdAt'
    | 'subjectsFormatted'
    | 'languages'
    | 'certificateOfConductDeactivationDate'
    | 'hasDoneEthicsOnboarding'
    | 'hasSpecialExperience'
    | 'gender'
    | 'descriptionForMatch'
> & {
    instructorScreenings?: InstructorScreening[];
    tutorScreenings?: TutorScreening[];
    matches: MatchWithPupil[];
    subcoursesInstructing: SubcourseForScreening[];
    certificateOfConduct?: Opt<Pick<Certificate_Of_Conduct, 'id'>>;
};
