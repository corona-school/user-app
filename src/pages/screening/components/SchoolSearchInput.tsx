import { Combobox } from '@/components/Combobox';
import { Label } from '@/components/Label';
import { ExternalSchoolSearch } from '@/gql/graphql';
import useSchoolSearch from '@/hooks/useExternalSchoolSearch';
import { cn } from '@/lib/Tailwind';
import { useState } from 'react';

interface SchoolSearchInputProps {
    className?: string;
    defaultValue?: string;
    onSelect: (school: ExternalSchoolSearch) => void;
}

export const SchoolSearchInput = ({ className, defaultValue, onSelect }: SchoolSearchInputProps) => {
    const [search, setSearch] = useState('');
    const [value, setValue] = useState(defaultValue);
    const { schools, isLoading } = useSchoolSearch({ name: search });

    const handleOnSelect = (id: string) => {
        const school = schools.find((e) => e.id === id);
        if (school) {
            setValue(school.id);
            onSelect(school);
        }
    };

    return (
        <div className="flex flex-col gap-y-2">
            <Label>Schule</Label>
            <Combobox
                values={schools.map((e) => ({ value: e.id, label: `${e.name}, ${e.zip}, ${e.city}` }))}
                value={value}
                onSearch={setSearch}
                onSelect={handleOnSelect}
                className={cn('w-[500px]', className)}
                isLoading={isLoading}
                searchPlaceholder="z.B Erich-Kästner-Schule"
                placeholder={defaultValue}
            />
        </div>
    );
};
