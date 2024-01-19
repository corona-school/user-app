import { Button, HStack, useTheme } from 'native-base';
import { TFuncKey, Trans } from 'react-i18next';

// Given an enum:
//  enum SomeEnum { A = "A", B = "B" }
// And some translations:
// someEnum: { A: "A text", B: "B text" }
//
// One can easily implement a selector:
// const SomeEnumSelector = EnumSelector(SomeEnum, it => `someEnum.${it}`);
export function EnumSelector<EnumValue extends Record<string, string>, Enum extends string = EnumValue[keyof EnumValue]>(
    values: EnumValue,
    translate: (it: Enum) => TFuncKey
) {
    return function Selector({ value, setValue }: { value: Enum | null; setValue: (it: Enum) => any }) {
        const { space } = useTheme();

        return (
            <HStack display="flex" flexWrap="wrap">
                {Object.values(values).map((it) => (
                    <Button margin={space['0.5']} onPress={() => setValue(it as Enum)} variant={it === value ? 'solid' : 'outline'}>
                        <Trans i18nKey={translate(it as Enum) as any} />
                    </Button>
                ))}
            </HStack>
        );
    };
}
