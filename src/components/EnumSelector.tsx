import { Button, HStack, useTheme } from 'native-base';
import { TFuncKey, useTranslation } from 'react-i18next';
import { asTranslationKey } from '../helper/string-helper';

// Given an enum:
//  enum SomeEnum { A = "A", B = "B" }
// And some translations:
// someEnum: { A: "A text", B: "B text" }
//
// One can easily implement a selector:
// const SomeEnumSelector = EnumSelector(SomeEnum, it => `someEnum.${it}`);
export function EnumSelector<EnumValue extends Record<string, string>, Enum extends string = EnumValue[keyof EnumValue]>(
    values: EnumValue,
    getTranslationKey: (it: Enum) => TFuncKey
) {
    return function Selector({ value, setValue }: { value: Enum | null; setValue: (it: Enum) => any }) {
        const { space } = useTheme();
        const { t } = useTranslation();

        return (
            <HStack display="flex" flexWrap="wrap">
                {Object.values(values).map((it) => (
                    <Button margin={space['0.5']} onPress={() => setValue(it as Enum)} variant={it === value ? 'solid' : 'outline'}>
                        {t(asTranslationKey(getTranslationKey(it as Enum)))}
                    </Button>
                ))}
            </HStack>
        );
    };
}
