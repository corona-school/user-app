import { Box, Button, Column, Heading, Row, useTheme, VStack, Text } from 'native-base';
import { useContext } from 'react';
import { RegistrationContext } from '../Registration';
import IconTagList from '../../widgets/IconTagList';
import { states } from '../../types/lernfair/State';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const UserState: React.FC = () => {
    const { userState, setUserState, setCurrentIndex } = useContext(RegistrationContext);
    const { space } = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    return (
        <VStack flex="1" marginTop={space['1']}>
            <Heading>{t(`registration.steps.4.subtitle`)}</Heading>
            <Text>{t(`registration.steps.4.weightingNote`)}</Text>
            <Row flexWrap="wrap" w="100%" mt={space['1']} marginBottom={space['2']}>
                {states.map((state, i) => (
                    <Column mb={space['0.5']} mr={space['0.5']}>
                        <IconTagList
                            initial={userState === state.key}
                            text={t(`lernfair.states.${state.key}` as unknown as TemplateStringsArray)}
                            onPress={() => setUserState(state.key)}
                            iconPath={`states/icon_${state.key}.svg`}
                        />
                    </Column>
                ))}
            </Row>
            <Box alignItems="center" marginTop={space['2']}>
                <Row space={space['1']} justifyContent="center">
                    <Column width="100%">
                        <Button
                            width="100%"
                            height="100%"
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                                setCurrentIndex(3);
                            }}
                        >
                            {t('back')}
                        </Button>
                    </Column>
                    <Column width="100%">
                        <Button width="100%" onPress={() => setCurrentIndex(5)}>
                            {t('next')}
                        </Button>
                    </Column>
                </Row>
            </Box>
        </VStack>
    );
};
export default UserState;
