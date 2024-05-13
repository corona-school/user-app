// @ts-nocheck
import LearningPartner from './LearningPartner';
import { MockStudent } from '../User';

export default {
    title: 'Organisms/Match/LearningPartner',
    component: LearningPartner,
};

export const LearningPartnerIsDissolved = {
    render: () => (
        <MockStudent>
            <LearningPartner
                name="My Name"
                subjects={[
                    {
                        name: 'Mathe',
                    },
                    {
                        name: 'Deutsch',
                    },
                ]}
                isDissolved={true}
            />
        </MockStudent>
    ),

    name: 'LearningPartner dissolved',
};

export const BaseLearningPartner = {
    render: () => (
        <MockStudent>
            <LearningPartner
                name="My Name"
                subjects={[
                    {
                        name: 'Mathe',
                    },
                    {
                        name: 'Deutsch',
                    },
                ]}
            />
        </MockStudent>
    ),

    name: 'LearningPartner',
};
