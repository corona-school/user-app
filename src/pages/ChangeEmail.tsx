import { Box, Flex, Heading, useBreakpointValue, useTheme, VStack, Text, Row, FormControl, Button } from 'native-base';
import WithNavigation from '../components/WithNavigation';
import Logo from '../assets/icons/lernfair/lf-logo.svg';
import { useTranslation } from 'react-i18next';
import TextInput from '../components/TextInput';

const ChangeEmail = () => {
    const { space, sizes } = useTheme();
    const { t } = useTranslation();
    const ContainerWidth = useBreakpointValue({
        base: '90%',
        lg: sizes['formsWidth'],
    });

    const buttonWidth = useBreakpointValue({
        base: '100%',
        lg: sizes['desktopbuttonWidth'],
    });

    return (
        <WithNavigation showBack hideMenu>
            <Flex overflowY="auto" height="100vh">
                <Box position="relative" paddingY={space['2']} mb={space['3']} justifyContent="center" alignItems="center">
                    <Logo />
                    <Heading mt={space['1']}>E-Mail neu setzen</Heading>
                </Box>
                <VStack space={space['1']} paddingX={space['1']} mt={space['1']} marginX="auto" width={ContainerWidth} justifyContent="center">
                    <Row marginBottom={3}>
                        <FormControl>
                            <TextInput width="100%" isRequired={true} placeholder={t('email')} />
                            <FormControl.ErrorMessage>{t('login.invalidMailMessage')}</FormControl.ErrorMessage>
                        </FormControl>
                    </Row>
                    <Row justifyContent="center">
                        <Button width={buttonWidth} isDisabled>
                            E-Mail ändern
                        </Button>
                    </Row>
                </VStack>
            </Flex>
        </WithNavigation>
    );
};

export default ChangeEmail;
