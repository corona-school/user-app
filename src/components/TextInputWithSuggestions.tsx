import { useTheme, VStack, HStack, Text } from 'native-base';
import { TextInput, Pressable } from 'react-native';

export function TextInputWithSuggestions({ value, setValue, suggestions }: { value: string; setValue: (it: string) => void; suggestions: string[] }) {
    const { space, colors } = useTheme();

    return (
        <VStack>
            <TextInput style={{ backgroundColor: colors.primary['100'], fontSize: 15, padding: space['2'] }} value={value} onChangeText={setValue} />
            <HStack paddingTop={space['1']} space={space['1']} display="flex" flexWrap="wrap">
                {suggestions.map((it) => (
                    <Pressable onPress={() => setValue(it)}>
                        <Text fontStyle="italic">{it}</Text>
                    </Pressable>
                ))}
            </HStack>
        </VStack>
    );
}
