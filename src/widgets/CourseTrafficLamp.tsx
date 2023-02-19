import { View, Text, Column, Row, Circle, InfoIcon, Pressable, useTheme, Container, Box, CloseIcon, Heading } from 'native-base';

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TrafficStatus } from '../types/lernfair/Course';
import useModal from '../hooks/useModal';

type Props = {
    status: TrafficStatus;
    infoPopupTitle?: string;
    infoPopupContent?: string;
    infoPopupLastContent?: string;
    hideText?: boolean;
    paddingY?: number;
    showBorder?: boolean;
};

const CourseTrafficLamp: React.FC<Props> = ({ status = 'free', infoPopupTitle, infoPopupContent, infoPopupLastContent, hideText, paddingY, showBorder }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { show, hide } = useModal();

    const padY = typeof paddingY === 'number' ? paddingY : 5;

    return (
        <View>
            <Row paddingY={padY}>
                <Column flexDirection="row" alignItems="center">
                    <Circle
                        borderWidth={showBorder ? 2 : undefined}
                        borderColor="lightText"
                        backgroundColor={status === 'free' ? 'primary.900' : status === 'last' ? 'warning.1000' : status === 'full' ? 'warning.500' : ''}
                        size="20px"
                        marginRight={3}
                    />
                    {!hideText && (
                        <Text marginRight={7} bold>
                            {status === 'free'
                                ? t('single.global.status.free')
                                : status === 'last'
                                ? t('single.global.status.last')
                                : status === 'full'
                                ? t('single.global.status.full')
                                : ''}
                        </Text>
                    )}
                    {infoPopupTitle && (
                        <Pressable
                            onPress={() => {
                                show(
                                    { variant: 'light' },
                                    <Container maxWidth="100%" padding={space['1']}>
                                        <Box marginBottom={space['2']}>
                                            <Pressable onPress={hide}>
                                                <CloseIcon color="primary.800" />
                                            </Pressable>
                                        </Box>
                                        <Box flexDirection="row" alignItems="center" marginBottom={3}>
                                            <InfoIcon marginRight={3} size="30" color="danger.100" />
                                            {infoPopupTitle && <Heading>{infoPopupTitle}</Heading>}
                                        </Box>
                                        <Box paddingY={space['0.5']}>{infoPopupContent && <Text marginBottom={space['0.5']}>{infoPopupContent}</Text>}</Box>

                                        <Box>
                                            <Row paddingY={space['0.5']}>
                                                <Column flexDirection="row" alignItems="center">
                                                    <Circle backgroundColor="warning.500" size="20px" marginRight={3} />
                                                    <Text marginRight={7} bold>
                                                        {t('single.global.status.full')}
                                                    </Text>
                                                </Column>
                                            </Row>
                                            <Row paddingY={space['0.5']}>
                                                <Column flexDirection="row" alignItems="center">
                                                    <Circle backgroundColor="warning.1000" size="20px" marginRight={3} />
                                                    <Text marginRight={7} bold>
                                                        {t('single.global.status.last')}
                                                    </Text>
                                                </Column>
                                            </Row>
                                            <Row paddingY={space['0.5']}>
                                                <Column flexDirection="row" alignItems="center">
                                                    <Circle backgroundColor="primary.900" size="20px" marginRight={3} />
                                                    <Text marginRight={7} bold>
                                                        {t('single.global.status.free')}
                                                    </Text>
                                                </Column>
                                            </Row>
                                        </Box>

                                        <Box paddingY={space['0.5']}>
                                            {infoPopupLastContent && <Text marginBottom={space['0.5']}>{infoPopupLastContent}</Text>}
                                        </Box>
                                    </Container>
                                );
                            }}
                        >
                            <InfoIcon marginRight={3} size="5" color="danger.100" />
                        </Pressable>
                    )}
                </Column>
            </Row>
        </View>
    );
};
export default CourseTrafficLamp;
