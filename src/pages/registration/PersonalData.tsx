import { Box, Button, Column, Row, useTheme, VStack } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import AlertMessage from '../../widgets/AlertMessage';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { gql, useMutation } from '@apollo/client';
import { RegistrationContext } from '../Registration';
import isEmail from 'validator/es/lib/isEmail';
import { Cooperation } from '../../gql/graphql';
import { InfoCard } from '../../components/InfoCard';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Typography } from '@/components/Typography';
import { renderTextWithEmailLinks } from '@/Utility';

export default function PersonalData({ cooperation }: { cooperation?: Cooperation }) {
    const {
        userType,
        firstname,
        setFirstname,
        lastname,
        setLastname,
        email,
        setEmail,
        password,
        setPassword,
        passwordRepeat,
        setPasswordRepeat,
        onNext,
        onPrev,
    } = useContext(RegistrationContext);
    usePageTitle(`Lern-Fair - Registrierung: Persönliche Daten für ${userType === 'pupil' ? 'Schüler:innen' : 'Helfer:innen'}`);

    const { t } = useTranslation();
    const { space } = useTheme();
    const { trackEvent } = useMatomo();

    const [showEmailNotAvailable, setShowEmailNotAvailable] = useState<boolean>(false);
    const [showNameMissing, setShowNameMissing] = useState<boolean>(false);
    const [showEmailValidate, setEmailValidate] = useState<boolean>(false);
    const [showPasswordLength, setShowPasswordLength] = useState<boolean>(false);
    const [showPasswordConfirmNoMatch, setShowPasswordConfirmNoMatch] = useState<boolean>(false);

    const [isEmailAvailable] = useMutation(gql`
        mutation isEmailAvailable($email: String!) {
            isEmailAvailable(email: $email)
        }
    `);

    const isInputValid = useCallback(() => {
        setShowNameMissing(!firstname || !lastname);
        setShowPasswordLength(password.length < 6);
        setShowPasswordConfirmNoMatch(password !== passwordRepeat);
        setEmailValidate(!isEmail(email));
        return password.length >= 6 && password === passwordRepeat && isEmail(email) && firstname && lastname;
    }, [email, firstname, lastname, password, passwordRepeat]);

    const checkEmail = useCallback(async () => {
        if (!isInputValid()) return;
        const validMail = email.toLowerCase();
        const res = await isEmailAvailable({ variables: { email: validMail } });

        if (res.data?.isEmailAvailable) {
            trackEvent({
                category: 'kurse',
                action: 'click-event',
                name: 'Registrierung – Account Informationen – Bestätigung',
                documentTitle: 'Registrierung – Seite 1',
            });
            onNext();
        }
        setShowEmailNotAvailable(!res.data?.isEmailAvailable);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, isEmailAvailable, isInputValid]);

    return (
        <VStack w="100%" space={space['1']} marginTop={space['1']}>
            {cooperation && (
                <InfoCard icon="loki" title={cooperation.welcomeTitle}>
                    <Typography className="text-white">
                        <span dangerouslySetInnerHTML={{ __html: renderTextWithEmailLinks(cooperation.welcomeMessage) }} />
                    </Typography>
                </InfoCard>
            )}

            <TextInput value={firstname} placeholder={t('firstname')} onChangeText={setFirstname} />
            <TextInput value={lastname} placeholder={t('lastname')} onChangeText={setLastname} />
            {showNameMissing && <AlertMessage content={t('registration.hint.name')} />}
            <TextInput keyboardType="email-address" placeholder={t('email')} onChangeText={setEmail} value={email} />
            {showEmailNotAvailable && <AlertMessage content={t('registration.hint.email.unavailable')} />}
            {showEmailValidate && <AlertMessage content={t('registration.hint.email.invalid')} />}
            <PasswordInput placeholder={t('password')} onChangeText={setPassword} value={password} />
            {showPasswordLength && <AlertMessage content={t('registration.hint.password.length')} />}
            <PasswordInput placeholder={t('registration.password_repeat')} onChangeText={setPasswordRepeat} value={passwordRepeat} />

            {showPasswordConfirmNoMatch && <AlertMessage content={t('registration.hint.password.nomatch')} />}

            <Box alignItems="center" marginTop={space['2']}>
                <Row space={space['1']} justifyContent="center">
                    <Column width="100%">
                        <Button width="100%" height="100%" variant="ghost" colorScheme="blueGray" onPress={onPrev}>
                            {t('back')}
                        </Button>
                    </Column>
                    <Column width="100%">
                        <Button width="100%" onPress={checkEmail}>
                            {t('next')}
                        </Button>
                    </Column>
                </Row>
            </Box>
        </VStack>
    );
}
