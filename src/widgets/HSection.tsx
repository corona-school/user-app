import { Box, Heading, Link, Row, useTheme } from 'native-base';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    title?: string;
    referenceTitle?: string;
    showAll?: boolean;
    children: ReactNode | ReactNode[];
    onShowAll?: () => any;
    smallTitle?: boolean;
    isDark?: boolean;
    scrollable?: boolean;
    wrap?: boolean;
    isNoSpace?: boolean;
    marginBottom?: number | string;
};

const HSection: React.FC<Props> = ({
    title,
    referenceTitle,
    isDark = false,
    showAll = false,
    scrollable = true,
    children,
    onShowAll,
    marginBottom,
    wrap,
    smallTitle,
    isNoSpace = false,
}) => {
    const { space, fontSizes } = useTheme();
    const { t } = useTranslation();
    return (
        <Box marginBottom={marginBottom}>
            <Row
                alignItems={'center'}
                justifyContent={'flex-end'}
                marginX={isNoSpace === false ? -space['1'] : 0}
                paddingX={isNoSpace === false ? space['1'] : 0}
                paddingY={space['0.5']}
            >
                {title && (
                    <Heading color={isDark ? 'lightText' : 'primary.900'} flex="1" fontSize={smallTitle ? fontSizes['md'] : fontSizes['xl']}>
                        {title}
                    </Heading>
                )}
                {showAll && <Link onPress={onShowAll}>{referenceTitle ? referenceTitle : t('all')}</Link>}
            </Row>
            <Row
                flexWrap={wrap ? 'wrap' : 'nowrap'}
                flexDirection={wrap ? 'column' : 'row'}
                paddingX={space['1']}
                paddingY={space['0.5']}
                overflowX={scrollable ? 'scroll' : 'hidden'}
                space={space['1']}
                marginX={-space['1']}
                paddingBottom={space['1']}
            >
                {children}
            </Row>
        </Box>
    );
};
export default HSection;
