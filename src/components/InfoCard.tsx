import { Text } from 'native-base';
import { Heading, HStack, useTheme, VStack } from 'native-base';
import { ColorType } from 'native-base/lib/typescript/components/types';
import { IconLoader } from './IconLoader';

export function InfoCard({
    title,
    message,
    icon,
    background,
    noMargin,
}: {
    title: string;
    message: string;
    background?: ColorType;
    icon: 'loki' | 'yes' | 'no';
    noMargin?: boolean;
}) {
    const { space } = useTheme();

    const iconPath = {
        yes: 'lf-yes.svg',
        no: 'lf-no.svg',
        loki: 'avatar_pupil_32.svg',
    }[icon];

    return (
        <HStack
            backgroundColor={background ?? 'primary.900'}
            color="white"
            padding="30px"
            borderRadius="15px"
            marginY={noMargin ? '' : '20px'}
            space={space['1']}
            display="flex"
        >
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
