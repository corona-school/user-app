import { Combobox } from '@/components/Combobox';
import { Label } from '@/components/Label';
import useSchoolSearch from '@/hooks/useExternalSchoolSearch';
import { cn } from '@/lib/Tailwind';
import { useState } from 'react';

interface SchoolSearchInputProps {
    className?: string;
}

const SchoolSearchInput = ({ className }: SchoolSearchInputProps) => {
    const [search, setSearch] = useState('');
    const [value, setValue] = useState('');
    const { schools, isLoading } = useSchoolSearch({ name: search });

    return (
        <div className="flex flex-col gap-y-2">
            <Label>Schule</Label>
            <Combobox
                values={schools.map((e) => ({ value: e.id, label: `${e.name}, ${e.zip}, ${e.city}` }))}
                value={value}
                onSearch={setSearch}
                onSelect={setValue}
                className={cn('w-[500px]', className)}
                isLoading={isLoading}
                placeholder="Schule"
                searchPlaceholder="z.B Erich-Kästner-Schule"
            />
        </div>
    );
};

export default SchoolSearchInput;
