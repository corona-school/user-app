import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Button, Container, Heading, Text, useTheme, Image, Link, useBreakpointValue } from 'native-base';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LFIconBook from '../../assets/icons/lernfair/onboarding/lf-onboarding-group.svg';
import LFImageLearing from '../../assets/images/course/course-blocker.jpg';
import CTACard from '../../widgets/CTACard';

type Props = {};

const PupilCourseBlocker: React.FC<Props> = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Helfer Kurse Blocker',
        });
    }, []);

    const ContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['containerWidth'],
    });

    const ContentContainerWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['contentContainerWidth'],
    });

    return (
        <>
            <Container maxWidth={ContainerWidth} width="100%" marginX="auto" paddingX={space['1.5']} alignItems="stretch" marginBottom={space['0.5']}>
                <Heading marginBottom={space['1']}>{t('course.blocker.pupil.title')}</Heading>
                <Image
                    width="100%"
                    height="400px"
                    borderRadius="15px"
                    marginBottom={space['1.5']}
                    source={{
                        uri: LFImageLearing,
                    }}
                />
                <Text maxWidth={ContentContainerWidth} marginBottom={space['1']}>
                    {t('course.blocker.pupil.firstContent')}
                </Text>
                <Text maxWidth={ContentContainerWidth} marginBottom={space['1']}>
                    {t('course.blocker.pupil.secContent')}
                    <Link> {t('course.blocker.pupil.here')} </Link>
                    {t('course.blocker.pupil.thrContent')}
                </Text>
                <Text maxWidth={ContentContainerWidth} bold marginBottom="4px">
                    {t('course.blocker.pupil.contentHeadline')}
                </Text>
                <Text maxWidth={ContentContainerWidth} marginBottom={space['1']}>
                    {t('course.blocker.pupil.content')}
                </Text>
            </Container>
            <Container maxWidth={ContainerWidth} width="100%" marginX="auto" paddingX={space['1.5']} marginBottom={space['1.5']} alignItems="stretch">
                <CTACard
                    width="100%"
                    variant="dark"
                    title={t('course.blocker.pupil.cta.title')}
                    content={t('course.blocker.pupil.cta.content')}
                    icon={<LFIconBook />}
                    button={<Button onPress={() => navigate('/onboarding-list')}>{t('course.blocker.pupil.cta.button')}</Button>}
                />
            </Container>
        </>
    );
};
export default PupilCourseBlocker;
