import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { Toggle } from '@/components/Toggle';
import { IconBackpack, IconHeartHandshake, IconUser } from '@tabler/icons-react';
import { useRegistrationForm } from './useRegistrationForm';
import { Typography } from '@/components/Typography';
import { PupilEmailOwner } from '@/gql/graphql';

interface EmailOwnerProps extends RegistrationStepProps {}

export const EmailOwner = ({ onBack, onNext }: EmailOwnerProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();

    return (
        <RegistrationStep onBack={onBack} onNext={onNext} isNextDisabled={!form.emailOwner}>
            <RegistrationStepTitle>{t('registration.steps.emailOwner.title')}</RegistrationStepTitle>
            <Typography variant="body-lg" className="text-center mb-10 md:whitespace-pre-line text-balance">
                {t('registration.steps.emailOwner.description')}
            </Typography>
            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-y-2 md:gap-y-4 gap-x-4 w-full max-w-[536px]">
                <Toggle
                    size="2xl"
                    className="w-full md:w-[260px] h-[80px] md:h-[100px]"
                    variant="white-primary"
                    pressed={form.emailOwner === PupilEmailOwner.Pupil}
                    onPressedChange={() => onFormChange({ emailOwner: PupilEmailOwner.Pupil })}
                >
                    <IconBackpack size={32} />
                    {t('registration.emailOwnerOptions.pupil')}
                </Toggle>
                <Toggle
                    size="2xl"
                    className="w-full md:w-[260px] h-[80px] md:h-[100px]"
                    variant="white-primary"
                    pressed={form.emailOwner === PupilEmailOwner.Parent}
                    onPressedChange={() => onFormChange({ emailOwner: PupilEmailOwner.Parent })}
                >
                    <IconUser size={32} />
                    {t('registration.emailOwnerOptions.parent')}
                </Toggle>
                <Toggle
                    size="2xl"
                    className="w-full md:w-[260px] h-[80px] md:h-[100px]"
                    variant="white-primary"
                    pressed={form.emailOwner === PupilEmailOwner.Other}
                    onPressedChange={() => onFormChange({ emailOwner: PupilEmailOwner.Other })}
                >
                    <IconHeartHandshake size={32} />
                    {t('registration.emailOwnerOptions.other')}
                </Toggle>
            </div>
        </RegistrationStep>
    );
};
