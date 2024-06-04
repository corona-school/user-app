// @ts-nocheck
import { MatchCertificateCard } from './MatchCertificateCard';

export default {
    title: 'Organisms/Match/MatchCertificateCard',
    component: MatchCertificateCard,
};

export const MatchCertificateCardAwaitingApproval = {
    render: () => (
        <MatchCertificateCard
            certificate={{
                pupil: {
                    firstname: 'Max',
                    lastname: 'Mustermann',
                },

                startDate: '1970-10-10T12:00',
                endDate: '1970-12-12T13:00',
                hoursPerWeek: 100,
                hoursTotal: 300,
                state: 'awaiting-approval',
            }}
        />
    ),

    name: 'MatchCertificateCard awaiting approval',
};

export const MatchCertificateCardManual = {
    render: () => (
        <MatchCertificateCard
            certificate={{
                pupil: {
                    firstname: 'Max',
                    lastname: 'Mustermann',
                },

                startDate: '1970-10-10T12:00',
                endDate: '1970-12-12T13:00',
                hoursPerWeek: 100,
                hoursTotal: 300,
                state: 'manual',
            }}
        />
    ),

    name: 'MatchCertificateCard manual',
};

export const MatchCertificateCardApproved = {
    render: () => (
        <MatchCertificateCard
            certificate={{
                pupil: {
                    firstname: 'Max',
                    lastname: 'Mustermann',
                },

                startDate: '1970-10-10T12:00',
                endDate: '1970-12-12T13:00',
                hoursPerWeek: 100,
                hoursTotal: 300,
                state: 'approved',
            }}
        />
    ),

    name: 'MatchCertificateCard approved',
};
