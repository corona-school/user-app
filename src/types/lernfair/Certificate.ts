export type LFCertificateStatus = 'approved' | 'awaiting-approval' | 'manual' | string;

type LFCertificateCategory = 'test' | 'xyzipd';

export type LFCertificate = {
    uuid: string;
    categories: LFCertificateCategory;
    certificateDate: string;
    startDate: string;
    endDate: string;
    hoursPerWeek: number;
    hoursTotal: number;
    medium: string;
    ongoingLessons: boolean;
    state: LFCertificateStatus;
    signatureDate?: string;
    signatureLocation?: string;
    subjectsFormatted: string[];
};
