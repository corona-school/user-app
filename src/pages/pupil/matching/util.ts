export enum MatchRequestStep {
    updateData = 'updateData',
    subjects = 'subjects',
    priority = 'priority',
    bookScreeningAppointment = 'bookScreeningAppointment',
}

export const pupilMatchRequestFlow: MatchRequestStep[] = [
    MatchRequestStep.subjects,
    MatchRequestStep.priority,
    MatchRequestStep.updateData,
    MatchRequestStep.bookScreeningAppointment,
];
