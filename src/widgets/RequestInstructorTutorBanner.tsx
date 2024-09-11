import { Box, Heading, Stack, Text, VStack, useBreakpointValue } from 'native-base';
import { useTranslation } from 'react-i18next';
import CheckIcon from '../assets/icons/lernfair/Icon_Done.svg';

type BannerProps = {
    headline: string;
};

const RequestInstructorTutorBanner: React.FC<BannerProps> = ({ headline }) => {
    const { t } = useTranslation();

    const isMobile = useBreakpointValue({
        base: true,
        lg: false,
    });
    return (
        <>
            <Stack direction="row" alignItems="center" mb="3">
                <Box pr="2">
                    <CheckIcon width={54} />
                </Box>
                <VStack w={isMobile ? '80%' : '90%'}>
                    <Heading fontSize="sm">{headline}</Heading>
                    <Text ml="1" fontSize="sm" ellipsizeMode="tail" numberOfLines={5}>
                        {t('introduction.banner.text')}
                    </Text>
                </VStack>
            </Stack>
        </>
    );
};

export default RequestInstructorTutorBanner;
