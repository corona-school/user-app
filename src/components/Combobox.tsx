import { IconCheck, IconSelector } from '@tabler/icons-react';
import { cn } from '@/lib/Tailwind';
import { Button } from '@/components/Button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/Command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { useState } from 'react';
import CenterLoadingSpinner from './CenterLoadingSpinner';

interface ComboboxItem {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface SingleComboboxProps {
    values: ComboboxItem[];
    value?: string;
    onSelect: (value: string) => void;
    multiple?: false;
}

interface MultiComboboxProps {
    values: ComboboxItem[];
    value?: string[];
    onSelect: (value: string[]) => void;
    multiple: true;
}

type ComboboxProps = (SingleComboboxProps | MultiComboboxProps) & {
    onCreate?: (name: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    onSearch?: (search: string) => void;
    search?: string;
    isLoading?: boolean;
    className?: string;
};

export const Combobox = ({
    value,
    values: options,
    searchPlaceholder,
    placeholder,
    emptyText,
    isLoading,
    onSearch,
    search,
    onCreate,
    onSelect,
    className,
    multiple,
}: ComboboxProps) => {
    const [open, setOpen] = useState(false);

    const getCurrentValueLabels = () => {
        if (!value) return;
        return options
            .reduce<string[]>((labels, current) => {
                if (value.includes(current.value)) {
                    return labels.concat(current.label);
                }
                return labels;
            }, [])
            .join(', ');
    };

    const getIsItemChecked = (e: string) => {
        if (!value) return;
        return value.includes(e);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="input"
                    size="input"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-full', (!value || !value?.length) && 'text-muted-foreground overflow-hidden', className)}
                    rightIcon={<IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                >
                    <div className="text-ellipsis overflow-hidden w-[90%] text-left">{value ? getCurrentValueLabels() : placeholder}</div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn('max-w-full p-0 w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]')}>
                <Command shouldFilter={false}>
                    <CommandInput placeholder={searchPlaceholder} onValueChange={onSearch} value={search} />
                    <CommandList>
                        <CommandEmpty className="py-0">
                            {onCreate && !isLoading && !options.length && search && (
                                <div
                                    className="relative flex cursor-default gap-2 select-none items-center rounded-sm mx-2 my-2 px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => {
                                        if (onCreate && search) {
                                            onCreate(search);
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    Eigene Eingabe speichern <b>“{search}”</b>
                                </div>
                            )}
                            <div className="flex cursor-pointer items-center justify-center gap-1">{!onSearch && emptyText}</div>
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((e) => (
                                <CommandItem
                                    key={`${e.value}-${e.label}}`}
                                    value={e.value}
                                    onSelect={(itemValue) => {
                                        if (multiple) {
                                            const current = (value as string[] | null) ?? [];
                                            const exists = current.includes(itemValue);
                                            const updated = exists ? current.filter((v) => v !== itemValue) : [...current, itemValue];
                                            onSelect(updated);
                                        } else {
                                            onSelect(itemValue === (value as unknown as string) ? '' : itemValue);
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    <IconCheck className={cn('mr-2 h-4 w-4', getIsItemChecked(e.value) ? 'opacity-100' : 'opacity-0')} />
                                    {e.icon}
                                    {e.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    {isLoading && <CenterLoadingSpinner className="my-2" />}
                </Command>
            </PopoverContent>
        </Popover>
    );
};
