import { useTranslation } from 'react-i18next';
import useSchoolSearch from '../../hooks/useExternalSchoolSearch';
import { School_Schooltype_Enum } from '../../gql/graphql';
import { usePageTitle } from '../../hooks/usePageTitle';
import { OptionalBadge, RegistrationStep, RegistrationStepProps, RegistrationStepTitle } from './RegistrationStep';
import { useMemo, useState } from 'react';
import { RegistrationForm, useRegistrationForm } from './useRegistrationForm';
import { Combobox } from '@/components/Combobox';
import { cn } from '@/lib/Tailwind';
import { Typography } from '@/components/Typography';
import { schooltypes } from '@/types/lernfair/SchoolType';
import { Maybe } from 'graphql/jsutils/Maybe';

interface SchoolSearchProps extends RegistrationStepProps {}

const SchoolSearch = ({ onBack, onNext }: SchoolSearchProps) => {
    const { form, onFormChange } = useRegistrationForm();
    const { t } = useTranslation();
    usePageTitle('Lern-Fair - Registrierung: Schulname');
    const [search, setSearch] = useState(form.school.name ?? '');
    const { schools, isLoading } = useSchoolSearch({ name: search });

    const handleOnSelect = (id: string) => {
        const newSelectedSchool = schools.find((e) => e.id === id);
        if (newSelectedSchool) {
            let schoolType: Maybe<string> = newSelectedSchool.schooltype;
            if (!schoolType) {
                schoolType = schooltypes.find((e) => {
                    const schoolTypeLabel = e.label.toLowerCase();
                    const selectedSchoolName = newSelectedSchool.name.toLowerCase();
                    return selectedSchoolName.includes(schoolTypeLabel);
                })?.key;
            }
            onFormChange({
                school: { ...newSelectedSchool, schooltype: schoolType as School_Schooltype_Enum },
                zipCode: newSelectedSchool.zip ?? undefined,
            });
        }
    };

    const handleOnCreate = (name: string) => {
        onFormChange({ school: { name }, zipCode: undefined });
    };

    const getLabel = (school: Pick<RegistrationForm['school'], 'name' | 'city'>) => {
        let label = school.name;
        if (school.city) label += `, ${school.city}`;
        return label ?? '';
    };

    const mappedSchools = useMemo(() => {
        return schools.map((school) => ({
            value: school.id,
            label: getLabel(school),
        }));
    }, [schools]);

    return (
        <RegistrationStep className="px-0" onBack={onBack} onNext={onNext}>
            <OptionalBadge />
            <RegistrationStepTitle className="md:mb-10 whitespace-pre">{t('registration.steps.school.title')} </RegistrationStepTitle>
            <div className="w-full md:w-[396px] flex flex-col gap-y-2">
                <Combobox
                    values={mappedSchools}
                    value={form.school?.id?.toString()}
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
