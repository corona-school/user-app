export enum MatchRequestStep {
    updateData = 'updateData',
    subjects = 'subjects',
    priority = 'priority',
    grades = 'grades',
    bookScreeningAppointment = 'bookScreeningAppointment',
}

export const pupilMatchRequestFlow: MatchRequestStep[] = [
    MatchRequestStep.subjects,
    MatchRequestStep.priority,
    MatchRequestStep.updateData,
    MatchRequestStep.bookScreeningAppointment,
];

export const studentMatchRequestFlow: MatchRequestStep[] = [MatchRequestStep.subjects, MatchRequestStep.grades, MatchRequestStep.updateData];
