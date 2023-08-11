import { Text } from 'native-base';
import { Heading, HStack, useTheme, VStack } from 'native-base';
import { IconLoader } from './IconLoader';

export function InfoCard({ title, message }: { title: string; message: string }) {
    const { space } = useTheme();

    return (
        <HStack backgroundColor="primary.900" color="white" padding="30px" borderRadius="15px" marginY="20px" space={space['1']}>
            <IconLoader iconPath="avatar_pupil_32.svg" />
            <VStack>
                <Heading color="white" paddingBottom="10px">
                    {title}
                </Heading>
                <Text color="white">{message}</Text>
            </VStack>
        </HStack>
    );
}
