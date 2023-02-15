import { t } from 'i18next';
import { VStack, useTheme, Heading, Column, Button, Box, Row } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { containsDAZ, DAZ } from '../../../types/subject';
import IconTagList from '../../../widgets/IconTagList';
import TwoColGrid from '../../../widgets/TwoColGrid';
import { RequestMatchContext } from './RequestMatch';

const German: React.FC = () => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const { setSubject, matchRequest, setCurrentIndex, removeSubject } = useContext(RequestMatchContext);

    // If the user already provides Daz, preselect to 'true' otherwise let the user decide again
    const [supportsDaz, setSupportsDaz] = useState<boolean | null>(() => (containsDAZ(matchRequest.subjects) ? true : null));

    const onNext = useCallback(() => {
        if (supportsDaz) {
            setSubject({ name: DAZ, grade: { min: 1, max: 13 } });
        } else {
            removeSubject(DAZ);
        }

        setCurrentIndex(3);
    }, [setSubject, removeSubject, setCurrentIndex, supportsDaz]);

    return (
        <VStack paddingX={space['1']} space={space['0.5']}>
            <Heading fontSize="2xl">Deutsch als Zweitsprache</Heading>
            <Heading>
                Kannst du dir vorstellen Schüler:innen zu unterstützen, die Deutsch als Zweitsprache sprechen und nur über wenige Deutschkenntnisse verfügen?
            </Heading>
            <TwoColGrid>
                <Column>
                    <IconTagList iconPath={`lf-yes.svg`} initial={supportsDaz ?? false} variant="selection" text="Ja" onPress={() => setSupportsDaz(true)} />
                </Column>
                <Column>
                    <IconTagList
                        iconPath={`lf-no.svg`}
                        initial={!(supportsDaz ?? true)}
                        variant="selection"
                        text="Nein"
                        onPress={() => setSupportsDaz(false)}
                    />
                </Column>
            </TwoColGrid>
            <Box borderBottomWidth={1} borderBottomColor="primary.grey" />
            <Box alignItems="center" marginTop={space['0.5']}>
                <Row space={space['1']} justifyContent="center">
                    <Column width="100%">
                        <Button height="100%" variant="outline" onPress={() => setCurrentIndex(1)}>
                            {t('lernfair.buttons.prev')}
                        </Button>
                    </Column>
                    <Column width="100%">
                        <Button onPress={onNext} isDisabled={!supportsDaz}>
                            {t('lernfair.buttons.next')}
                        </Button>
                    </Column>
                </Row>
            </Box>
        </VStack>
    );
};
export default German;
