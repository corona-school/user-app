import { Box, Button, Column, Heading, Row, useTheme, VStack, Text } from 'native-base';
import { useContext, useState } from 'react';
import { RegistrationContext } from '../Registration';
import IconTagList from '../../widgets/IconTagList';
import { states } from '../../types/lernfair/State';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../../hooks/usePageTitle';
import { State } from '../../gql/graphql';
import AlertMessage from '../../widgets/AlertMessage';

const UserState: React.FC = () => {
    const { school, setSchool, onPrev, onNext } = useContext(RegistrationContext);
    const { space } = useTheme();
    const { t } = useTranslation();
    usePageTitle('Lern-Fair - Registrierung: Schulort');

    const [showStateMissing, setShowStateMissing] = useState<boolean>(false);

    const handleNext = () => {
        if (!school?.state) {
            setShowStateMissing(true);
        } else {
            onNext();
        }
    };

    const handleStateSelection = (stateKey: string) => {
        setSchool({ ...school, state: stateKey as State });
        setShowStateMissing(false);
    };

    return (
        <VStack flex="1" marginTop={space['1']}>
            <Heading>{t(`registration.steps.state.subtitle`)}</Heading>
            <Text>{t(`registration.steps.state.weightingNote`)}</Text>
            <Row flexWrap="wrap" w="100%" mt={space['1']} marginBottom={space['2']}>
                {states.map((state, i) => (
                    <Column key={i} mb={space['0.5']} mr={space['0.5']}>
                        <IconTagList
                            initial={school?.state === state.key}
                            text={t(`lernfair.states.${state.key}` as unknown as TemplateStringsArray)}
                            onPress={() => handleStateSelection(state.key)}
                            iconPath={`states/icon_${state.key}.svg`}
                        />
                    </Column>
                ))}
            </Row>
            {showStateMissing && <AlertMessage content={t('registration.hint.userStateSelectionMissing')} />}
            <Box alignItems="center" marginTop={space['2']}>
                <Row space={space['1']} justifyContent="center">
                    <Column width="100%">
                        <Button width="100%" height="100%" variant="ghost" colorScheme="blueGray" onPress={onPrev}>
                            {t('back')}
                        </Button>
                    </Column>
                    <Column width="100%">
                        <Button width="100%" onPress={handleNext}>
                            {t('next')}
                        </Button>
                    </Column>
                </Row>
            </Box>
        </VStack>
    );
};

export default UserState;
