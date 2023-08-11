import { Text } from 'native-base';
import { Heading, HStack, useTheme, VStack } from 'native-base';
import { IconLoader } from './IconLoader';

export function InfoCard({ title, message, icon }: { title: string; message: string; icon: 'loki' | 'yes' | 'no' }) {
    const { space } = useTheme();

    const iconPath = {
        yes: 'lf-yes.svg',
        no: 'lf-no.svg',
        loki: 'avatar_pupil_32.svg',
    }[icon];

    return (
        <HStack backgroundColor="primary.900" color="white" padding="30px" borderRadius="15px" marginY="20px" space={space['1']} display="flex">
            <IconLoader iconPath={iconPath} />
            <VStack flexGrow="1" display="flex">
                <Heading color="white" paddingBottom="10px">
                    {title}
                </Heading>
                <Text color="white" overflow={'auto'}>
                    {message}
                </Text>
            </VStack>
        </HStack>
    );
}
