import { Box, Button, Card, InfoIcon, Spacer, Stack, Text, Tooltip, useBreakpointValue, useTheme } from 'native-base';
import { useTranslation } from 'react-i18next';
import { Course_Coursestate_Enum } from '../gql/graphql';
import { useMemo } from 'react';

type BannerProps = {
    courseState: Course_Coursestate_Enum;
    isCourseCancelled: boolean;
    isPublished: boolean;
    handleButtonClick: () => void;
};

const Banner: React.FC<BannerProps> = ({ courseState, isCourseCancelled, isPublished, handleButtonClick }) => {
    const { t } = useTranslation();
    const { sizes } = useTheme();
    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });

    const stateText = useMemo(() => {
        if (courseState === Course_Coursestate_Enum.Created) return t('single.banner.created.draft');
        if (courseState === Course_Coursestate_Enum.Submitted) return t('single.banner.submitted.isChecked');
        if (courseState === Course_Coursestate_Enum.Allowed && !isPublished) return t('single.banner.allowedNotPublished.checked');
        if (courseState === Course_Coursestate_Enum.Allowed && isPublished) return t('single.banner.allowedAndPublished.published');
        if (courseState === Course_Coursestate_Enum.Denied) return t('single.banner.rejected.state');
        return 'default';
    }, [courseState, isPublished]);

    const stateButtonText = useMemo(() => {
        if (courseState === Course_Coursestate_Enum.Created) return t('single.banner.created.button');
        if (courseState === Course_Coursestate_Enum.Allowed && isPublished) return t('single.banner.allowedAndPublished.button');
        if (courseState === Course_Coursestate_Enum.Allowed && !isPublished) return t('single.banner.allowedNotPublished.button');
        if (courseState === Course_Coursestate_Enum.Denied) return t('single.banner.rejected.button');
        return 'default';
    }, [courseState, isPublished]);

    const stateTooltipText = useMemo(() => {
        switch (courseState) {
            case Course_Coursestate_Enum.Created:
                return t('single.banner.created.info');
            case Course_Coursestate_Enum.Submitted:
                return t('single.banner.submitted.info');
            case Course_Coursestate_Enum.Allowed:
                return t('single.banner.allowedNotPublished.info');
            case Course_Coursestate_Enum.Denied:
                return t('single.banner.rejected.info');
            default:
                return 'Test';
        }
    }, [courseState]);

    return (
        <Box>
            {!isCourseCancelled && (
                <Card bg="primary.100" maxWidth={sizes['imageHeaderWidth']}>
                    <Stack direction={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'flext-start' : 'center'}>
                        <Stack direction="row" mb={isMobile ?? '3'}>
                            <Text bold fontSize="md">
                                {t('single.banner.state')}
                            </Text>
                            <Text ml="1" fontSize="md">
                                {stateText}
                            </Text>

                            <Tooltip
                                maxWidth={270}
                                label={!isPublished ? stateTooltipText : t('single.banner.allowedAndPublished.info')}
                                _text={{ textAlign: 'center' }}
                                p={3}
                                hasArrow
                                children={<InfoIcon ml={3} size="5" color="danger.100" />}
                            />
                        </Stack>

                        <Spacer />

                        <Stack w={isMobile ?? 'full'}>
                            {courseState !== Course_Coursestate_Enum.Submitted && (
                                <Button variant="outline" onPress={handleButtonClick}>
                                    {stateButtonText}
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </Card>
            )}
        </Box>
    );
};

export default Banner;
