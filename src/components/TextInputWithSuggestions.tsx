import { useTheme, VStack, HStack, Text, Input, Button } from 'native-base';

export function TextInputWithSuggestions({ value, setValue, suggestions }: { value: string; setValue: (it: string) => void; suggestions: string[] }) {
    const { space } = useTheme();

    return (
        <VStack>
            <Input value={value} onChangeText={setValue} />
            <HStack paddingTop={space['0.5']} space={space['0.5']} display="flex" flexWrap="wrap">
                {suggestions.map((it) => (
                    <Button onPress={() => setValue(it)} my={'0.5'} variant="ghost" colorScheme="tertiary" size="xs">
                        <Text fontStyle="italic" fontSize="sm">
                            {it}
                        </Text>
                    </Button>
                ))}
            </HStack>
        </VStack>
    );
}
