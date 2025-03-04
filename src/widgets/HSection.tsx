import { Box, Heading, Link, Row, Select, Stack, useBreakpointValue, useTheme } from 'native-base';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    title?: string;
    section?: 'draft' | 'current' | 'past';
    referenceTitle?: string;
    showAll?: boolean;
    showSort?: boolean;
    children: ReactNode | ReactNode[];
    onShowAll?: () => any;
    sortBy?: (section: 'draft' | 'current' | 'past' | undefined, value: 'updatedAt' | 'start') => any;
    smallTitle?: boolean;
    isDark?: boolean;
    scrollable?: boolean;
    wrap?: boolean;
    isNoSpace?: boolean;
    marginBottom?: number | string;
};

const HSection: React.FC<Props> = ({
    title,
    section,
    referenceTitle,
    isDark = false,
    showAll = false,
    showSort = false,
    scrollable = true,
    children,
    onShowAll,
    sortBy,
    marginBottom,
    wrap,
    smallTitle,
    isNoSpace = false,
}) => {
    const { space, fontSizes } = useTheme();
    const { t } = useTranslation();

    const stackDir = useBreakpointValue({ base: 'column', md: 'row' });
    const stackAlign = useBreakpointValue({ base: 'flex-start', md: 'center' });
    return (
        <Box marginBottom={marginBottom}>
            <Stack
                direction={stackDir}
                alignItems={stackAlign}
                justifyContent={'flex-end'}
                marginX={isNoSpace === false ? -space['1'] : 0}
                paddingX={isNoSpace === false ? space['1'] : 0}
                paddingY={space['0.5']}
            >
                {title && (
                    <Heading color={isDark ? 'lightText' : 'primary.900'} flex="8" fontSize={smallTitle ? fontSizes['md'] : fontSizes['xl']}>
                        {title}
                    </Heading>
                )}
                {showAll && (
                    <Link onPress={onShowAll} flex="1">
                        {referenceTitle ? referenceTitle : t('all')}
                    </Link>
                )}
                {showSort && (
                    <Select placeholder={t('sortBy')} flex="2" onValueChange={(value) => sortBy && sortBy(section, value as 'updatedAt' | 'start')}>
                        <Select.Item label={t('updatedAt')} value="updatedAt" />
                        <Select.Item label={t('lectureDate')} value="start" />
                    </Select>
                )}
            </Stack>
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
