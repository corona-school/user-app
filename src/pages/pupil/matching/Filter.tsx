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

    const bulletPoints: String[] = [
        'Du brauchst Hilfe in der Schule',
        'Deine Familie kann dir nicht bei deinen Hausaufgaben helfen',
        'Deine Familie kann keine Nachhilfe für dich bezahlen',
    ];

    return (
        <VStack>
            {currentIndex === 0 && (
                <VStack space={space['0.5']}>
                    <Heading fontSize="2xl">Die 1:1-Lernunterstützung</Heading>
                    <Heading>Für wen ist die 1:1-Lernunterstützung gedacht?</Heading>

                    <Text>Wenn folgende Punkte auf dich zutreffen, kannst du eine 1:1-Lernunterstützung bei uns beantragen:</Text>

                    <Box my={space['0.5']}>
                        <BulletList bulletPoints={bulletPoints} />
                    </Box>

                    <Heading fontSize="md">Treffen diese Punkte auf dich zu?</Heading>
                    <YesNoSelector
                        initialYes={isFit === 'yes'}
                        initialNo={isFit === 'no'}
                        onPressYes={() => setIsFit('yes')}
                        onPressNo={() => setIsFit('no')}
                        align="left"
                    />
                    <br />
                    <Heading>Lange Wartezeit: 3-6 Monate</Heading>
                    <Text>
                        Zur Zeit brauchen sehr viele Schüler:innen Lernunterstützung. Deshalb haben wir eine lange Warteliste. Wahrscheinlich musst du 3-6
                        Monate warten, bevor wir eine:n Lernpartner:in für dich finden können.
                    </Text>

                    <Heading fontSize="md">Bist du bereit, 3-6 Monate zu warten?</Heading>
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
                            heading={'Kennst du schon Edu-Cloud?'}
                            text={
                                'Dort findest du viele Angebote, die für dich interessant sein können. Bei Fragen kannst du dich gerne jederzeit bei uns melden.'
                            }
                            button1={{ text: 'Zur Edu-Cloud', link: () => window.open('https://edu-cloud.org', '_blank') }}
                            button2={{ text: 'Zu den Gruppen-Kursen', link: () => navigate('/group') }}
                        />
                    ) : (
                        <AlternativeOffer
                            heading={'Kennst du schon unsere Hausaufgabenhilfe?'}
                            text={
                                'Du hast eine Frage zu deinen Hausaufgaben? Zwischen 16:00 und 17:00 Uhr sind wir vom Lern-Fair Team auf Zoom und können dir bei deinen Hausaufgaben helfen.'
                            }
                            button1={{ text: 'Zu den Gruppen-Kursen', link: () => navigate('/group') }}
                            button2={{
                                text: 'Zur Hausaufgabenhilfe',
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
