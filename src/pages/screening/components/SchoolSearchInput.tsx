import { Combobox } from '@/components/Combobox';
import { Label } from '@/components/Label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';
import { ExternalSchoolSearch } from '@/gql/graphql';
import useSchoolSearch from '@/hooks/useExternalSchoolSearch';
import { cn } from '@/lib/Tailwind';
import { IconCircleCheckFilled, IconAlertTriangleFilled } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SchoolSearchInputProps {
    className?: string;
    defaultValue?: Partial<ExternalSchoolSearch>;
    onSelect: (school: Partial<ExternalSchoolSearch>) => void;
}

export const SchoolSearchInput = ({ className, defaultValue, onSelect }: SchoolSearchInputProps) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState(defaultValue?.name ?? '');
    const [school, setSchool] = useState<Partial<ExternalSchoolSearch> | undefined>(defaultValue);
    const { schools, isLoading } = useSchoolSearch({ name: search });

    const handleOnSelect = (id: string) => {
        const newSelectedSchool = schools.find((e) => e.id === id);
        if (newSelectedSchool) {
            setSchool(newSelectedSchool);
            onSelect(newSelectedSchool);
        }
    };

    const handleOnCreate = (name: string) => {
        setSchool({ name });
        onSelect({ name });
    };

    const getLabel = (school: Partial<ExternalSchoolSearch>) => {
        let label = school.name;
        if (school.zip) label += `, ${school.zip}`;
        if (school.city) label += `, ${school.city}`;
        return label ?? '';
    };

    return (
        <div className="flex flex-col gap-y-2">
            <Label>Schule</Label>
            <div className="flex gap-x-2 items-center justify-center">
                <Combobox
                    values={schools.map((e) => ({ value: e.id, label: getLabel(e) }))}
                    value={school?.id?.toString()}
                    onSearch={setSearch}
                    search={search}
                    onCreate={handleOnCreate}
                    onSelect={handleOnSelect}
                    className={cn('w-[500px]', className)}
                    isLoading={isLoading}
                    searchPlaceholder="z.B Erich-Kästner-Schule"
                    placeholder={defaultValue ? getLabel(defaultValue) : ''}
                    filterSearchResult={(e, s) => e.label.toLowerCase().includes(s.toLowerCase())}
                />

                {school?.name && !school.zip && !school.city && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <IconAlertTriangleFilled className="text-yellow-500" />
                            </TooltipTrigger>
                            <TooltipContent>{t('registration.steps.school.otherSchoolFound')}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
                {school?.id && school.zip && school.city && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <IconCircleCheckFilled className="text-green-600" />
                            </TooltipTrigger>
                            <TooltipContent>{t('registration.steps.school.schoolFound')}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </div>
    );
};
