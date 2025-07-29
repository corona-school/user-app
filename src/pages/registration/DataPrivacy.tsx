import { useTranslation } from 'react-i18next';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useRegistrationForm } from './useRegistrationForm';
import { Typography } from '@/components/Typography';
import { Checkbox, CheckedState } from '@/components/Checkbox';
import { Label } from '@/components/Label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/Accordion';
import { Button } from '@/components/Button';
import { IconSend } from '@tabler/icons-react';

interface DataPrivacyProps extends RegistrationStepProps {
    onRegisterWithPassword: () => Promise<void>;
}

export const DataPrivacy = ({ onBack, onRegisterWithPassword }: DataPrivacyProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();

    const onChange = (consent: CheckedState) => {
        onFormChange({ privacyConsent: !!consent });
    };

    return (
        <RegistrationStep onBack={onBack} className="md:pt-20">
            <RegistrationStepTitle className="mb-10 max-w-[440px]">{t('registration.steps.dataPrivacy.title')}</RegistrationStepTitle>
            <div className="max-h-[393px] md:max-h-[425px] overflow-y-auto h-full">
                <div className="flex flex-col gap-y-5 max-w-[440px]">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="data-usage">
                            <AccordionTrigger className="py-0">
                                <Typography className="font-medium" variant="body-lg">
                                    {t('registration.steps.dataPrivacy.dataUsageInfoLabel')}
                                </Typography>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 pt-5">
                                <ol className="flex flex-col gap-y-2">
                                    <li>
                                        <Typography> 1. {t(`registration.steps.dataPrivacy.usageBullets.1`)}</Typography>
                                    </li>
                                    <li>
                                        <Typography>2. {t(`registration.steps.dataPrivacy.usageBullets.2`)}</Typography>
                                    </li>
                                    <li>
                                        <Typography>3. {t(`registration.steps.dataPrivacy.usageBullets.3`)}</Typography>
                                    </li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <div className="flex flex-col gap-y-2 w-full">
                        <div className="w-full bg-white p-4 gap-x-4 pr-3 flex items-center rounded-md">
                            <Checkbox checked={form.privacyConsent} onCheckedChange={onChange} className="size-4" id="homeworkHelp" />{' '}
                            <Label htmlFor="homeworkHelp" className="text-base font-normal w-full cursor-pointer">
                                {t('registration.steps.dataPrivacy.labelTermsAndPrivacy')}
                            </Label>
                        </div>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="data-usage-usa">
                            <AccordionTrigger className="py-0">
                                <Typography variant="body-lg">{t('registration.steps.dataPrivacy.dataUsageUSA')}</Typography>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance pt-5">
                                <Typography>{t('registration.steps.dataPrivacy.accordionUsDataProcessors')}</Typography>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                <Button size="lg" className="w-full mt-10" rightIcon={<IconSend size={16} />} disabled={!form.privacyConsent} onClick={onRegisterWithPassword}>
                    {t('registration.steps.dataPrivacy.sendRegistration')}
                </Button>
            </div>
        </RegistrationStep>
    );
};
