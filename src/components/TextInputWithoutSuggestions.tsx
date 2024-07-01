import { VStack, Input } from 'native-base';

export function TextInputWithoutSuggestions({
    value,
    setValue,
    placeholder,
    maxLength,
}: {
    value: string;
    setValue: (it: string) => void;
    placeholder: string;
    maxLength: number;
}) {
    return (
        <VStack>
            <Input value={value} onChangeText={setValue} placeholder={placeholder} maxLength={maxLength} />
        </VStack>
    );
}
