import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { Button, Container, Heading, Text, useTheme, Image, Link, useBreakpointValue } from 'native-base';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LFIconBook from '../../assets/icons/lernfair/onboarding/lf-onboarding-group.svg';
import LFImageLearing from '../../assets/images/course/course-blocker.jpg';
import CTACard from '../../widgets/CTACard';

type Props = {};

const CourseBlocker: React.FC<Props> = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Helfer Kurse Blocker',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <Heading marginBottom={space['1']}>{t('course.blocker.student.title')}</Heading>
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
                    {t('course.blocker.student.firstContent')}
                </Text>
                <Text maxWidth={ContentContainerWidth} marginBottom={space['1']}>
                    {t('course.blocker.student.secContent')}
                    <Link> {t('course.blocker.student.here')} </Link>
                    {t('course.blocker.student.thrContent')}
                </Text>
                <Text maxWidth={ContentContainerWidth} bold marginBottom="4px">
                    {t('course.blocker.student.contentHeadline')}
                </Text>
                <Text maxWidth={ContentContainerWidth} marginBottom={space['1']}>
                    {t('course.blocker.student.content')}
                </Text>
            </Container>
            <Container maxWidth={ContainerWidth} width="100%" marginX="auto" paddingX={space['1.5']} marginBottom={space['1.5']} alignItems="stretch">
                <CTACard
                    className="w-full"
                    title={t('course.blocker.student.cta.title')}
                    icon={<LFIconBook />}
                    button={<Button onPress={() => navigate('/onboarding-list')}>{t('course.blocker.student.cta.button')}</Button>}
                >
                    {t('course.blocker.student.cta.content')}
                </CTACard>
            </Container>
        </>
    );
};
export default CourseBlocker;
