import { cn } from '@/lib/Tailwind';
import { StringMap, TOptions } from 'i18next';
import { ReactNode } from 'react';
import { TFuncKey, useTranslation } from 'react-i18next';
import { asTranslationKey } from '../helper/string-helper';
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
    className?: string;
    variant?: ToggleVariants;
}

interface MultiSelectorProps<Enum> {
    value?: Enum[] | null;
    setValue: (it: Enum[]) => any;
    multiple: true;
    className?: string;
    variant?: ToggleVariants;
}

export type SelectorProps<Enum> = SingleSelectorProps<Enum> | MultiSelectorProps<Enum>;

export function EnumSelector<EnumValue extends Record<string, string>, Enum extends string = EnumValue[keyof EnumValue]>(
    values: EnumValue,
    getTranslation: (it: Enum) => TFuncKey | [TFuncKey, TOptions<StringMap>],
    getIcon?: (it: Enum) => ReactNode
) {
    return function Selector({ value, setValue, className, multiple, variant = { size: 'lg', variant: 'outline' } }: SelectorProps<Enum>) {
        const { t } = useTranslation();

        return (
            <div className={cn('flex flex-wrap gap-2', className)}>
                {Object.values(values).map((it) => {
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
                            variant={variant.variant}
                            onPressedChange={handleChange}
                            key={it}
                            size={variant.size}
                            className="justify-center gap-2"
                        >
                            <>
                                {getIcon && getIcon(it as Enum)}
                                {Array.isArray(translation) ? t(...translation) : t(asTranslationKey(translation))}
                            </>
                        </Toggle>
                    );
                })}
            </div>
        );
    };
}
