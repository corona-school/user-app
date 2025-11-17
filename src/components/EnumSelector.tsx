import { cn } from '@/lib/Tailwind';
import { StringMap, TOptions } from 'i18next';
import { ReactNode, useMemo, useState } from 'react';
import { TFuncKey, useTranslation } from 'react-i18next';
import { asTranslationKey } from '../helper/string-helper';
import { Combobox } from './Combobox';
import { Toggle, ToggleVariants } from './Toggle';

// Given an enum:
//  enum SomeEnum { A = "A", B = "B" }
// And some translations:
// someEnum: { A: "A text", B: "B text" }
//
// One can easily implement a selector:
// const SomeEnumSelector = EnumSelector(SomeEnum, it => `someEnum.${it}`);

interface SingleSelectorProps<Enum> {
    value?: Enum | null;
    setValue: (it: Enum) => any;
    multiple?: false;
}

interface MultiSelectorProps<Enum> {
    value?: Enum[] | null;
    setValue: (it: Enum[]) => any;
    multiple: true;
}

export type SelectorProps<Enum> = (SingleSelectorProps<Enum> | MultiSelectorProps<Enum>) & {
    className?: string;
    maxVisibleItems?: number;
    toggleConfig?: {
        className?: string;
        variant?: ToggleVariants['variant'];
        size?: ToggleVariants['size'];
    };
    searchConfig?: {
        containerClassName?: string;
        className?: string;
        placeholder?: string;
    };
};

export function EnumSelector<EnumValue extends Record<string, string>, Enum extends string = EnumValue[keyof EnumValue]>(
    values: EnumValue,
    getTranslation: (it: Enum) => TFuncKey | [TFuncKey, TOptions<StringMap>],
    getIcon?: (it: Enum) => ReactNode
) {
    return function Selector({
        value,
        setValue,
        className,
        multiple,
        toggleConfig = {
            variant: 'outline',
            size: 'lg',
            className,
        },
        maxVisibleItems,
        searchConfig,
    }: SelectorProps<Enum>) {
        const { t } = useTranslation();
        const gridItemsCount = maxVisibleItems ?? Object.values(values).length;
        const gridItems = Object.values(values).slice(0, gridItemsCount);
        const [search, setSearch] = useState('');

        const memoizedSearchItems = useMemo(() => {
            const searchItems = Object.values(values).slice(gridItemsCount, Object.values(values).length);
            return searchItems.map((e) => {
                const enumValue = e as Enum;
                const translation = getTranslation(enumValue);
                return { value: e, label: `${t(asTranslationKey(translation as any))}`, icon: getIcon?.(enumValue) };
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [search, gridItemsCount]);

        return (
            <div className={cn('flex flex-wrap gap-2', className)}>
                {gridItems.map((it) => {
                    const enumValue = it as Enum;
                    const translation = getTranslation(enumValue);

                    const isSelected = multiple ? (value as Enum[] | undefined)?.includes(enumValue) : enumValue === value;
                    const handleChange = () => {
                        if (multiple) {
                            const current = (value as Enum[] | null) ?? [];
                            const exists = current.includes(enumValue);
                            const updated = exists ? current.filter((v) => v !== enumValue) : [...current, enumValue];
                            setValue(updated);
                        } else {
                            setValue(enumValue);
                        }
                    };

                    return (
                        <Toggle
                            pressed={isSelected}
                            variant={toggleConfig.variant}
                            onPressedChange={handleChange}
                            key={it}
                            size={toggleConfig.size}
                            className={cn('justify-center gap-2', toggleConfig.className)}
                        >
                            <>
                                {getIcon && getIcon(it as Enum)}
                                <span>{Array.isArray(translation) ? (t(...translation) as any) : t(asTranslationKey(translation))}</span>
                            </>
                        </Toggle>
                    );
                })}
                {searchConfig && (
                    <div className={searchConfig?.containerClassName}>
                        <Combobox
                            values={memoizedSearchItems}
                            value={multiple ? value?.filter((e) => !gridItems.includes(e)) : (value as any)}
                            onSearch={setSearch}
                            search={search}
                            multiple={multiple}
                            onSelect={(e: any) => {
                                if (multiple) {
                                    const selectedItemsFromGrid = (value ?? []).filter((e) => gridItems.includes(e));
                                    setValue(selectedItemsFromGrid.concat(e));
                                } else {
                                    setValue(e);
                                }
                                setSearch('');
                            }}
                            className={cn(searchConfig?.className)}
                            isLoading={false}
                            placeholder={searchConfig?.placeholder}
                            filterSearchResult={(e, s) => e.label.toLowerCase().includes(s.toLowerCase())}
                        />
                    </div>
                )}
            </div>
        );
    };
}
