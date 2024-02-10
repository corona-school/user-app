import { Course, Course_Tag, Instructor_Screening, Lecture, Match, Pupil, Pupil_Screening, Screener, Screening, Student, Subcourse } from '../gql/graphql';

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

export type PupilScreening = Opt<Pick<Pupil_Screening, 'id' | 'createdAt' | 'updatedAt' | 'comment' | 'status' | 'invalidated'>> & {
    screeners: Pick<Screener, 'firstname' | 'lastname'>[];
};

export type PupilForScreening = Pick<
    Pupil,
    'active' | 'id' | 'firstname' | 'lastname' | 'email' | 'createdAt' | 'subjectsFormatted' | 'languages' | 'grade' | 'gradeAsInt' | 'openMatchRequestCount'
> & {
    screenings?: PupilScreening[];
    matches?: MatchWithStudent[];
};

export type InstructorScreening = Pick<Instructor_Screening, 'success' | 'createdAt' | 'comment'> & { screener: Pick<Screener, 'firstname' | 'lastname'> };

export type TutorScreening = Pick<Screening, 'createdAt' | 'success' | 'comment'> & { screener: Pick<Screener, 'firstname' | 'lastname'> };

export type SubcourseForScreening = Pick<Subcourse, 'id' | 'published'> & {
    course: Pick<Course, 'name' | 'image'> & { tags: Pick<Course_Tag, 'name'>[] };
    nextLecture?: Opt<Pick<Lecture, 'start' | 'duration'>>;
};

export type StudentForScreening = Pick<Student, 'active' | 'id' | 'email' | 'firstname' | 'lastname' | 'createdAt' | 'subjectsFormatted' | 'languages'> & {
    instructorScreenings?: InstructorScreening[];
    tutorScreenings?: TutorScreening[];
    matches: MatchWithPupil[];
    subcoursesInstructing: SubcourseForScreening[];
};
