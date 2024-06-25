import { Text, Box, Row, InfoIcon, CloseIcon, Pressable, useTheme, Container, Tooltip, useBreakpointValue, Column } from 'native-base';
import Card from '../components/Card';

import { Fragment, ReactNode } from 'react';
import CSSWrapper from '../components/CSSWrapper';

type Props = {
    title: string;
    infotooltip?: string;
    icon?: ReactNode;
    onClose?: () => any;
    content: ReactNode | ReactNode[];
    button?: ReactNode;
    closeable?: boolean;
    variant?: 'normal' | 'outline' | 'dark';
    marginBottom?: number;
    width?: number | string;
    height?: number | string;
    isOnboardingCard?: boolean;
    buttonIsBanner?: boolean;
};

const CTACard: React.FC<Props> = ({
    width,
    height,
    title,
    infotooltip,
    content,
    button,
    icon,
    closeable = false,
    variant = 'normal',
    isOnboardingCard = false,
    onClose,
    marginBottom = 0,
    buttonIsBanner = false,
}) => {
    const { space } = useTheme();

    const Wrapper = variant === 'normal' ? Card : Fragment;

    const CardMobileDirection = useBreakpointValue({
        base: 'column',
        lg: 'row',
    });

    const CardMobileJContent = useBreakpointValue({
        base: 'stretch',
        lg: 'space-between',
    });

    const CardMobileAlignItems = useBreakpointValue({
        base: 'stretch',
        lg: 'center',
    });

    const ButtonDirection = useBreakpointValue({
        base: 'column',
        lg: 'row',
    });

    const IconSpaceBottom = useBreakpointValue({
        base: space['1'],
        lg: 0,
    });

    return (
        <Wrapper flexibleWidth width={width} isFullHeight>
            <Box
                w="100%"
                height={height}
                flexDirection={CardMobileDirection}
                justifyContent={CardMobileJContent}
                alignItems={CardMobileAlignItems}
                mb={marginBottom}
                backgroundColor={variant === 'dark' ? 'primary.900' : 'primary.300'}
                padding={variant === 'normal' || variant === 'dark' ? space['1.5'] : 0}
                borderRadius={15}
                flexWrap={'wrap'}
            >
                <Row flexWrap={'wrap'} w="100%" justifyContent={closeable ? 'space-between' : ''}>
                    <Container maxWidth="100%" flexDirection={isOnboardingCard ? 'column' : ButtonDirection} width="100%">
                        <CSSWrapper className="cta-card__wrapper">
                            {icon && (
                                <CSSWrapper className="cta-card__item cta-card__item--icon">
                                    <Box marginBottom={isOnboardingCard ? space['1'] : IconSpaceBottom}>{icon}</Box>
                                </CSSWrapper>
                            )}
                            <CSSWrapper className="cta-card__item cta-card__item--content">
                                <Column>
                                    <Text
                                        maxWidth="340px"
                                        bold
                                        fontSize={'lg'}
                                        flex="1"
                                        marginBottom={space['0.5']}
                                        color={variant === 'dark' ? 'lightText' : 'primary.800'}
                                        display="flex"
                                    >
                                        {title}

                                        {infotooltip && (
                                            <Tooltip label={infotooltip}>
                                                <Box marginLeft="10px" marginRight={space['2']} marginBottom={IconSpaceBottom}>
                                                    <InfoIcon />
                                                </Box>
                                            </Tooltip>
                                        )}
                                    </Text>
                                    <Text color={variant === 'dark' ? 'lightText' : 'primary.800'} maxWidth="500px">
                                        {content}
                                    </Text>
                                </Column>
                            </CSSWrapper>
                            <CSSWrapper
                                className={
                                    isOnboardingCard
                                        ? 'cta-card__item cta-card__item--button cta-card__item--button--onboarding'
                                        : 'cta-card__item cta-card__item--button'
                                }
                                style={buttonIsBanner ? { flexBasis: '100%' } : {}}
                            >
                                <Column>{button && <Box marginTop={space['1']}>{button}</Box>}</Column>
                            </CSSWrapper>
                        </CSSWrapper>
                    </Container>
                    {closeable && (
                        <Pressable onPress={onClose} testID="close">
                            <CloseIcon />
                        </Pressable>
                    )}
                </Row>
            </Box>
        </Wrapper>
    );
};
export default CTACard;
