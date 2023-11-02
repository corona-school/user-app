import { Box, Heading, Text, useTheme, VStack } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import { YesNoSelector } from '../../../widgets/YesNoSelector';
import { RequestMatchContext } from './RequestMatch';
import AlternativeOffer from './AlternativeOffer';
import BulletList from '../../../widgets/BulletList';

const Filter: React.FC = () => {
    const { space } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { setCurrentIndex: goToIndex } = useContext(RequestMatchContext);
    const [isFit, setIsFit] = useState<'yes' | 'no'>();
    const [isAcceptWaitingTime, setIsAcceptWaitingTime] = useState<'yes' | 'no'>();
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const next = useCallback(() => {
        if (isFit !== 'yes' || isAcceptWaitingTime !== 'yes') {
            setCurrentIndex(1);
            return;
        }
        goToIndex(1);
    }, [goToIndex, isAcceptWaitingTime, isFit]);

    return (
        <VStack>
            {currentIndex === 0 && (
                <VStack space={space['0.5']}>
                    <Heading fontSize="2xl">{t('matching.wizard.pupil.filter.heading')}</Heading>
                    <Heading>{t('matching.wizard.pupil.filter.subheading1')}</Heading>

                    <Text>{t('matching.wizard.pupil.filter.text1')}</Text>

                    <Box my={space['0.5']}>
                        <BulletList bulletPoints={t('matching.wizard.pupil.filter.bulletPoints', { returnObjects: true })} />
                    </Box>

                    <Heading fontSize="md">{t('matching.wizard.pupil.filter.question1')}</Heading>
                    <YesNoSelector
                        initialYes={isFit === 'yes'}
                        initialNo={isFit === 'no'}
                        onPressYes={() => setIsFit('yes')}
                        onPressNo={() => setIsFit('no')}
                        align="left"
                    />
                    <br />
                    <Heading>{t('matching.wizard.pupil.filter.subheading2')}</Heading>
                    <Text>{t('matching.wizard.pupil.filter.text2')}</Text>

                    <Heading fontSize="md">{t('matching.wizard.pupil.filter.question2')}</Heading>
                    <YesNoSelector
                        initialYes={isAcceptWaitingTime === 'yes'}
                        initialNo={isAcceptWaitingTime === 'no'}
                        onPressYes={() => setIsAcceptWaitingTime('yes')}
                        onPressNo={() => setIsAcceptWaitingTime('no')}
                        align="left"
                    />
                    <Box marginTop={space['1']} borderBottomWidth={1} borderBottomColor="primary.grey" />
                    <NextPrevButtons isDisabledNext={!isFit || !isAcceptWaitingTime} onPressNext={next} onlyNext />
                </VStack>
            )}
            {currentIndex === 1 && (
                <>
                    {isFit === 'no' ? (
                        <AlternativeOffer
                            heading={t('matching.wizard.pupil.alternatives.educloud.heading')}
                            text={t('matching.wizard.pupil.alternatives.educloud.text')}
                            button1={{
                                text: t('matching.wizard.pupil.alternatives.educloud.button'),
                                link: () => window.open('https://edu-cloud.org', '_blank'),
                            }}
                            button2={{ text: t('matching.wizard.pupil.alternatives.groupcourses.button'), link: () => navigate('/group') }}
                        />
                    ) : (
                        <AlternativeOffer
                            heading={t('matching.wizard.pupil.alternatives.homeworkhelp.heading')}
                            text={t('matching.wizard.pupil.alternatives.homeworkhelp.text')}
                            button1={{ text: t('matching.wizard.pupil.alternatives.groupcourses.button'), link: () => navigate('/group') }}
                            button2={{
                                text: t('matching.wizard.pupil.alternatives.homeworkhelp.button'),
                                link: () => window.open('https://www.lern-fair.de/hausaufgabenhilfe-anmeldung', '_blank'),
                            }}
                        />
                    )}
                </>
            )}
        </VStack>
    );
};
export default Filter;
