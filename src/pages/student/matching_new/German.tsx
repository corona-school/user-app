import { t } from 'i18next';
import { VStack, useTheme, Heading, Column, Button, Box, Row } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import IconTagList from '../../../widgets/IconTagList';
import TwoColGrid from '../../../widgets/TwoColGrid';
import { RequestMatchContext } from './RequestMatch';

const German: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { setMatching, setCurrentIndex } = useContext(RequestMatchContext);
    const [supportDaz, setSupportDaz] = useState<'yes' | 'no'>();

    const onGoNext = useCallback(() => {
        setMatching((prev) => ({ ...prev, setDazSupport: supportDaz === 'yes' }));
        setCurrentIndex(3); // school classes
    }, [setMatching, setCurrentIndex, supportDaz]);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Deutsch als Zweitsprache</Heading>
            <Heading>
                Kannst du dir vorstellen Schüler:innen zu unterstützen, die Deutsch als Zweitsprache sprechen und nur über wenige Deutschkenntnisse verfügen?
            </Heading>
            <Box alignItems="center">
                <Box maxWidth="600px" width="100%">
                    <TwoColGrid>
                        <Column>
                            <IconTagList
                                iconPath={`lf-yes.svg`}
                                initial={supportDaz === 'yes'}
                                variant="selection"
                                text="Ja"
                                onPress={() => setSupportDaz('yes')}
                            />
                        </Column>
                        <Column>
                            <IconTagList
                                iconPath={`lf-no.svg`}
                                initial={supportDaz === 'no'}
                                variant="selection"
                                text="Nein"
                                onPress={() => setSupportDaz('no')}
                            />
                        </Column>
                    </TwoColGrid>
                </Box>
            </Box>
            <Box borderBottomWidth={1} borderBottomColor="primary.grey" />
            <Box alignItems="center" marginTop={space['0.5']}>
                <Row space={space['1']} justifyContent="center">
                    <Column width="100%">
                        <Button height="100%" variant="outline" onPress={() => setCurrentIndex(1)}>
                            {t('lernfair.buttons.prev')}
                        </Button>
                    </Column>
                    <Column width="100%">
                        <Button onPress={onGoNext} isDisabled={!supportDaz}>
                            {t('lernfair.buttons.next')}
                        </Button>
                    </Column>
                </Row>
            </Box>
        </VStack>
    );
};
export default German;
