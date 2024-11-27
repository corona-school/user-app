import { cn } from '@/lib/Tailwind';
import { StringMap, TOptions } from 'i18next';
import { ReactNode } from 'react';
import { TFuncKey, useTranslation } from 'react-i18next';
import { asTranslationKey } from '../helper/string-helper';
import { Toggle } from './Toggle';

// Given an enum:
//  enum SomeEnum { A = "A", B = "B" }
// And some translations:
// someEnum: { A: "A text", B: "B text" }
//
// One can easily implement a selector:
// const SomeEnumSelector = EnumSelector(SomeEnum, it => `someEnum.${it}`);

interface SelectorProps<Enum> {
    value?: Enum | null;
    setValue: (it: Enum) => any;
    className?: string;
}

export function EnumSelector<EnumValue extends Record<string, string>, Enum extends string = EnumValue[keyof EnumValue]>(
    values: EnumValue,
    getTranslation: (it: Enum) => TFuncKey | [TFuncKey, TOptions<StringMap>],
    getIcon?: (it: Enum) => ReactNode
) {
    return function Selector({ value, setValue, className }: SelectorProps<Enum>) {
        const { t } = useTranslation();

        return (
            <div className={cn('flex flex-wrap gap-2', className)}>
                {Object.values(values).map((it) => {
                    const translation = getTranslation(it as Enum);
                    return (
                        <Toggle
                            pressed={it === value}
                            variant="outline"
                            onPressedChange={() => {
                                setValue(it as Enum);
                            }}
                            key={it}
                            size="lg"
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
