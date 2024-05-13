import { Box, useTheme, Row, useBreakpointValue, Stack, Heading } from 'native-base';
import { ReactNode } from 'react';
import BackButton from './BackButton';

type Props = {
    children?: ReactNode | ReactNode[];
    title?: string;
    leftContent?: ReactNode | ReactNode[];
    rightContent?: ReactNode | ReactNode[];
    onBack?: () => any;
    showBack?: boolean;
    previousFallbackRoute?: string;
};

/**
 * Is used to display views below the scrollable header seamlessly.
 * -  use `leftContent`and `rightContent` to display content on either side
 * - `showBack` / `onBack` to use navigation in here
 */
const HeaderCard: React.FC<Props> = ({ children, title, leftContent, rightContent, onBack, showBack, previousFallbackRoute }) => {
    const { space, sizes } = useTheme();

    const headerTitleSize = useBreakpointValue({
        base: 14,
        lg: 19,
    });

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    return (
        <Box bgColor="primary.900" paddingY={`${sizes['headerPaddingYPx']}px`} borderBottomRadius={8} zIndex={9999}>
            <Box h={`${sizes['headerSizePx']}px`} position="fixed" top="0" left="0" right="0" bgColor="primary.900" zIndex="1">
                <Row alignItems="center" justifyContent="center" h="100%" padding={space[1]}>
                    {showBack && (
                        <Box ml={space['2']} position="absolute" left="0" zIndex={5}>
                            <BackButton onPress={onBack} previousFallbackRoute={previousFallbackRoute} />
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
