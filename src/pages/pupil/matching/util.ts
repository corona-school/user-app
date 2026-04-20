export enum MatchRequestStep {
    updateData = 'updateData',
    german = 'german',
    subjects = 'subjects',
    priority = 'priority',
    bookScreeningAppointment = 'bookScreeningAppointment',
}

export const pupilMatchRequestFlow: MatchRequestStep[] = [
    MatchRequestStep.updateData,
    MatchRequestStep.german,
    MatchRequestStep.subjects,
    MatchRequestStep.priority,
    MatchRequestStep.bookScreeningAppointment,
];
