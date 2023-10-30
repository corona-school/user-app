import { Box, Button, Column, Heading, Text, useTheme, VStack } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import IconTagList from '../../../widgets/IconTagList';
import { NextPrevButtons } from '../../../widgets/NextPrevButtons';
import TwoColGrid from '../../../widgets/TwoColGrid';
import { YesNoSelector } from '../../../widgets/YesNoSelector';
import { RequestMatchContext } from './RequestMatch';

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
                    <Heading fontSize="2xl">Die 1:1-Lernunterstützung</Heading>
                    <Heading>Für wen ist die 1:1-Lernunterstützung gedacht?</Heading>

                    <Text>Wenn folgende Punkte auf dich zutreffen, kannst du eine 1:1-Lernunterstützung bei uns beantragen:</Text>

                    <Box my={space['0.5']}>
                        <Text>● Du brauchst Hilfe in der Schule</Text>
                        <Text>● Deine Familie kann dir nicht bei deinen Hausaufgaben helfen</Text>
                        <Text>● Deine Familie kann keine Nachhilfe für dich bezahlen</Text>
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
                <VStack space={space['0.5']}>
                    <Heading fontSize="2xl">Alternative Angebote</Heading>

                    <Text>
                        Leider können wir dich bei Lern-Fair in diesem Fall nicht unterstützen. Unsere Hilfe wird von freiwilligen Helfer:innen angeboten.
                        Deshalb haben wir nur begrenzte Plätze und möchten vor allem denjenigen Schüler:innen helfen, die folgende Kriterien erfüllen:
                    </Text>

                    <Text>● Du brauchst Hilfe beim Lernen.</Text>
                    <Text>● Du hast Nachteile beim Lernen.</Text>
                    <Text>● Deine Familie kann dir nicht beim Lernen helfen.</Text>
                    <Text>● Deine Familie kann keine Nachhilfe für dich bezahlen.</Text>

                    {isFit === 'no' ? (
                        <>
                            <Heading fontSize="md" mt={space['1']}>
                                Kennst du schon Edu-Cloud?
                            </Heading>

                            <Text>
                                Dort findest du viele Angebote, die für dich interessant sein können. Bei Fragen kannst du dich gerne jederzeit bei uns melden.
                            </Text>

                            <NextPrevButtons
                                altPrevText="Zur Edu-Cloud"
                                altNextText="Zu den Gruppen-Kursen"
                                onPressPrev={() => window.open('https://edu-cloud.org', '_blank')}
                                onPressNext={() => navigate('/group')}
                            />
                        </>
                    ) : (
                        <>
                            <Heading fontSize="md" mt={space['1']}>
                                Kennst du schon unsere Hausaufgabenhilfe?
                            </Heading>

                            <Text>
                                Du hast eine Frage zu deinen Hausaufgaben? Zwischen 16:00 und 17:00 Uhr sind wir vom Lern-Fair Team auf Zoom und können dir bei
                                deinen Hausaufgaben helfen.
                            </Text>

                            <Text>Bei Fragen kannst du dich gerne jederzeit bei uns melden.</Text>

                            <NextPrevButtons
                                altPrevText="Zu den Gruppen-Kursen"
                                altNextText="Zur Hausaufgabenhilfe"
                                onPressPrev={() => navigate('/group')}
                                onPressNext={() => window.open('https://www.lern-fair.de/hausaufgabenhilfe-anmeldung', '_blank')}
                            />
                        </>
                    )}
                </VStack>
            )}
        </VStack>
    );
};
export default Filter;
