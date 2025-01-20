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
}

interface ComboboxProps {
    values: ComboboxItem[];
    value?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    onSearch?: (search: string) => void;
    search?: string;
    onSelect: (value: string) => void;
    onCreate?: (name: string) => void;
    isLoading?: boolean;
    className?: string;
}

export const Combobox = ({
    value,
    values,
    searchPlaceholder,
    placeholder,
    emptyText,
    isLoading,
    onSearch,
    search,
    onCreate,
    onSelect,
    className,
}: ComboboxProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="input"
                    size="input"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('w-full', !value && 'text-muted-foreground overflow-hidden', className)}
                    rightIcon={<IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                >
                    <div className="text-ellipsis overflow-hidden w-[90%] text-left">{values.find((e) => e.value === value)?.label ?? placeholder}</div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn('max-w-full p-0 w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]')}>
                <Command shouldFilter={false}>
                    <CommandInput placeholder={searchPlaceholder} onValueChange={onSearch} value={search} />
                    <CommandList>
                        <CommandEmpty className="py-0">
                            {onCreate && !isLoading && !values.length && (
                                <div
                                    className="relative flex cursor-default gap-2 select-none items-center rounded-sm mx-2 my-2 px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => {
                                        if (onCreate && search) {
                                            onCreate(search);
                                        }
                                        if (onSearch) {
                                            onSearch('');
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    {search}
                                </div>
                            )}
                            <div className="flex cursor-pointer items-center justify-center gap-1">{!onSearch && emptyText}</div>
                        </CommandEmpty>
                        <CommandGroup>
                            {values.map((e) => (
                                <CommandItem
                                    key={`${e.value}-${e.label}}`}
                                    value={e.value}
                                    onSelect={(currentValue) => {
                                        onSelect(currentValue === value ? '' : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <IconCheck className={cn('mr-2 h-4 w-4', value === e.value ? 'opacity-100' : 'opacity-0')} />
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
