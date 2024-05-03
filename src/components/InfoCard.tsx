import { Text } from 'native-base';
import { Heading, HStack, useTheme, VStack } from 'native-base';
import { ColorType } from 'native-base/lib/typescript/components/types';
import { IconLoader } from './IconLoader';
import React from 'react';

interface InfoCardProps {
    title: string;
    message?: string;
    children?: React.ReactNode;
    background?: ColorType;
    icon: 'loki' | 'yes' | 'no';
    noMargin?: boolean;
}

export function InfoCard({ title, message, children, icon, background, noMargin }: InfoCardProps) {
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
            <VStack>
                <IconLoader iconPath={iconPath} />
            </VStack>
            <VStack flexGrow="1" flexShrink="1" display="flex">
                <Heading color="white" paddingBottom="10px">
                    {title}
                </Heading>
                {!children && message && <Text color="white">{message}</Text>}
                {children && children}
            </VStack>
        </HStack>
    );
}
