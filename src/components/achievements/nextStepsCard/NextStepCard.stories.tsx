import NextStepsCard from './NextStepsCard';
import { Achievement_Action_Type_Enum } from '../../../gql/graphql';
import NextStepsExample01 from '../../../assets/images/achievements/Next_Steps_Example_01.png';
import IconVideoKonf from '../../../assets/images/achievements/Icon_VideoKonf.png';
import { Meta } from '@storybook/react';

const meta: Meta<typeof NextStepsCard> = {
    title: 'Organisms/Achievements/NextStepsCard',
    component: NextStepsCard,
};

export default meta;

export const NextStepsCardBasic = {
    render: () => (
        <NextStepsCard
            image={NextStepsExample01}
            title="Mathe Grundkurs"
            name="Kurs anbieten"
            maxSteps={4}
            currentStep={1}
            actionDescription="Jetzt zur Prüfung freigeben"
            actionType={Achievement_Action_Type_Enum.Action}
        />
    ),

    name: 'Next Steps Card',
};

export const NextStepsCardDescription = {
    render: () => (
        <NextStepsCard
            image={IconVideoKonf}
            title="Weitere Engagement-Möglichkeiten"
            name="Lust auf mehr?"
            description="Möchtest du weitere Schüler:innen un-terstützen? Biete einen Gruppenkurs oder weitere Lernpartnerschaften an."
            actionDescription="Jetzt Möglichkeiten ansehen"
            actionType={Achievement_Action_Type_Enum.Action}
        />
    ),

    name: 'Next Steps Card Description',
};
