import { Box, useTheme, Heading, Row, useBreakpointValue, HStack, Stack } from 'native-base';
import { ReactNode } from 'react';
import BackButton from './BackButton';

type Props = {
    children?: ReactNode | ReactNode[];
    title?: string;
    leftContent?: ReactNode | ReactNode[];
    rightContent?: ReactNode | ReactNode[];
    onBack?: () => any;
    showBack?: boolean;
};

const HeaderCard: React.FC<Props> = ({ children, title, leftContent, rightContent, onBack, showBack }) => {
    const { space, sizes } = useTheme();

    const headerTitleSize = useBreakpointValue({
        base: 14,
        lg: 19,
    });

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    // useEffect(() => {
    //   portal && portal(children)
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    return (
        <Box bgColor="primary.900" paddingY={`${sizes['headerPaddingYPx']}px`} borderBottomRadius={8} zIndex={9999}>
            <Box h={`${sizes['headerSizePx']}px`} position="fixed" top="0" left="0" right="0" bgColor="primary.900" zIndex="1">
                <Row alignItems="center" justifyContent="center" h="100%" padding={space[1]}>
                    {showBack && (
                        <Box ml={space['2']} position="absolute" left="0" zIndex={5}>
                            <BackButton onPress={onBack} />
                        </Box>
                    )}
                    {(isMobile && (
                        <Heading fontSize={headerTitleSize} color="lightText" flex="1" textAlign={'center'} position={'fixed'}>
                            {title}
                        </Heading>
                    )) || (
                        <Box position={'relative'} flex="1">
                            {children}
                        </Box>
                    )}
                    {isMobile ? (
                        <Stack alignItems="center" direction="row" width={'100%'} justifyContent={'space-between'}>
                            <Box ml={showBack ? space[3] : 0}>{rightContent}</Box>
                            <Stack alignItems="center" direction="row">
                                <Box>{leftContent}</Box>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack>
                            <Stack alignItems="center" direction="row">
                                <Box>{leftContent}</Box>
                                <Box>{rightContent}</Box>
                            </Stack>
                        </Stack>
                    )}
                </Row>
            </Box>
            {isMobile && children && (
                <Box paddingX={space['1']} paddingTop={'56px'}>
                    {children}
                </Box>
            )}
        </Box>
    );
};

export default HeaderCard;
