const pupilIdToUserId = (pupilId: number): string => `pupil/${pupilId}`;
const studentIdToUserId = (studentId: number): string => `student/${studentId}`;
const userIdToTalkJsId = (userId: string): string => userId.replace('/', '_');

export { pupilIdToUserId, studentIdToUserId, userIdToTalkJsId };
