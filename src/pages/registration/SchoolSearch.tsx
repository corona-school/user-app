import { useTranslation } from 'react-i18next';
import useSchoolSearch from '../../hooks/useExternalSchoolSearch';
import { ExternalSchoolSearch } from '../../gql/graphql';
import { usePageTitle } from '../../hooks/usePageTitle';
import { RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useState } from 'react';
import { useRegistrationForm } from './useRegistrationForm';
import { Combobox } from '@/components/Combobox';
import { cn } from '@/lib/Tailwind';
import { Typography } from '@/components/Typography';

interface SchoolSearchProps extends RegistrationStepProps {}

const SchoolSearch = ({ onBack, onNext }: SchoolSearchProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    usePageTitle('Lern-Fair - Registrierung: Schulname');
    const [search, setSearch] = useState(form.school.name);
    const { schools, isLoading } = useSchoolSearch({ name: search });

    const handleOnSelect = (id: string) => {
        const newSelectedSchool = schools.find((e) => e.id === id);
        if (newSelectedSchool) {
            onFormChange({ school: newSelectedSchool });
        }
    };

    const handleOnCreate = (name: string) => {
        onFormChange({ school: { name } });
    };

    const getLabel = (school: Partial<ExternalSchoolSearch>) => {
        let label = school.name;
        if (school.zip) label += `, ${school.zip}`;
        if (school.city) label += `, ${school.city}`;
        return label ?? '';
    };

    return (
        <RegistrationStep className="px-0" onBack={onBack} onNext={onNext}>
            <RegistrationStepTitle className="md:mb-10 whitespace-pre">{t('registration.steps.school.title')} </RegistrationStepTitle>
            <div className="w-full md:w-[396px] flex flex-col gap-y-2">
                <Combobox
                    values={schools.map((e) => ({ value: e.id, label: getLabel(e) }))}
                    value={form.school?.id}
                    onSearch={setSearch}
                    search={search}
                    onCreate={handleOnCreate}
                    onSelect={handleOnSelect}
                    className={cn('w-full bg-white border-none')}
                    isLoading={isLoading}
                    searchPlaceholder="z.B Erich-Kästner-Schule"
                    placeholder={form.school.name ? getLabel(form.school) : ''}
                />
                <Typography variant="subtle" className="text-center font-medium leading-2">
                    {t('registration.steps.school.helperText')}
                </Typography>
            </div>
        </RegistrationStep>
    );
};

export default SchoolSearch;
