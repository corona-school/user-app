import { Box, Button, Column, Row, useTheme, VStack } from 'native-base';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '../../components/TextInput';
import PasswordInput from '../../components/PasswordInput';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { gql, useMutation } from '@apollo/client';
import { RegistrationContext } from '../Registration';
import isEmail from 'validator/es/lib/isEmail';
import { Cooperation, PupilEmailOwner } from '../../gql/graphql';
import { InfoCard } from '../../components/InfoCard';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Typography } from '@/components/Typography';
import { renderTextWithEmailLinks } from '@/Utility';
import { Label } from '@/components/Label';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';

export default function PersonalData({ cooperation }: { cooperation?: Cooperation }) {
    const {
        userType,
        pupilAge,
        setPupilAge,
        emailOwner,
        setEmailOwner,
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
    const [showAgeMissing, setShowAgeMissing] = useState(false);
    const [showEmailOwnerMissing, setShowEmailOwnerMissing] = useState(false);

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
        if (userType === 'pupil') {
            setShowAgeMissing(!pupilAge);
            setShowEmailOwnerMissing(!emailOwner || emailOwner === PupilEmailOwner.Unknown);
        }
        const arePupilOnlyFieldsValid = emailOwner !== PupilEmailOwner.Unknown && pupilAge;
        const areGeneralFieldsValid = password.length >= 6 && password === passwordRepeat && isEmail(email) && firstname && lastname;
        return userType === 'student' ? areGeneralFieldsValid : areGeneralFieldsValid && arePupilOnlyFieldsValid;
    }, [email, firstname, lastname, password, passwordRepeat, pupilAge, emailOwner]);

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
            {userType === 'pupil' && <Typography variant="h5">{t('registration.personal.pupilSubtitle')}</Typography>}
            {userType === 'pupil' && (
                <div className="flex flex-col gap-y-1">
                    <RadioGroup
                        value={pupilAge}
                        onValueChange={(nextValue) => {
                            setPupilAge(nextValue === '<= 15' ? '<= 15' : '> 15');
                        }}
                        className="flex flex-row gap-x-4"
                    >
                        <div className="flex gap-x-2 items-center">
                            <RadioGroupItem id="ageOption1" value="<= 15" />
                            <Label htmlFor="ageOption1">{t('registration.ageOptions.15OrYounger')}</Label>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <RadioGroupItem id="ageOption2" value="> 15" />
                            <Label htmlFor="ageOption2">{t('registration.ageOptions.16OrOlder')}</Label>
                        </div>
                    </RadioGroup>
                    {showAgeMissing && (
                        <Typography variant="sm" className="text-destructive">
                            {t('registration.hint.radioSelectionMissing')}
                        </Typography>
                    )}
                </div>
            )}
            <div className="flex flex-col gap-y-2">
                <TextInput value={firstname} placeholder={t('firstname')} onChangeText={setFirstname} />
                <TextInput value={lastname} placeholder={t('lastname')} onChangeText={setLastname} />
                {showNameMissing && (
                    <Typography variant="sm" className="text-destructive">
                        {t('registration.hint.name')}
                    </Typography>
                )}
            </div>
            {userType === 'pupil' && (
                <div className="flex flex-col gap-y-1">
                    <RadioGroup
                        value={emailOwner}
                        onValueChange={(nextValue) => {
                            setEmailOwner(nextValue as PupilEmailOwner);
                        }}
                        className="flex flex-row gap-x-4"
                    >
                        <div className="flex gap-x-2 items-center">
                            <RadioGroupItem id="emailOwner1" value={PupilEmailOwner.Pupil} />
                            <Label htmlFor="emailOwner1">{t('registration.emailOwnerOptions.pupil')}</Label>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <RadioGroupItem id="emailOwner2" value={PupilEmailOwner.Parent} />
                            <Label htmlFor="emailOwner2">{t('registration.emailOwnerOptions.parent')}</Label>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <RadioGroupItem id="emailOwner3" value={PupilEmailOwner.Other} />
                            <Label htmlFor="emailOwner3">{t('registration.emailOwnerOptions.other')}</Label>
                        </div>
                    </RadioGroup>
                    {showEmailOwnerMissing && (
                        <Typography variant="sm" className="text-destructive">
                            {t('registration.hint.radioSelectionMissing')}
                        </Typography>
                    )}
                </div>
            )}
            <div className="flex flex-col gap-y-1">
                <TextInput keyboardType="email-address" placeholder={t('email')} onChangeText={setEmail} value={email} />
                {showEmailNotAvailable && (
                    <Typography variant="sm" className="text-destructive">
                        {t('registration.hint.email.unavailable')}
                    </Typography>
                )}
                {showEmailValidate && (
                    <Typography variant="sm" className="text-destructive">
                        {t('registration.hint.email.invalid')}
                    </Typography>
                )}
            </div>
            <div className="flex flex-col gap-y-1">
                <PasswordInput placeholder={t('password')} onChangeText={setPassword} value={password} />
                {showPasswordLength && (
                    <Typography variant="sm" className="text-destructive">
                        {t('registration.hint.password.length')}
                    </Typography>
                )}
                <PasswordInput placeholder={t('registration.password_repeat')} onChangeText={setPasswordRepeat} value={passwordRepeat} />

                {showPasswordConfirmNoMatch && (
                    <Typography variant="sm" className="text-destructive">
                        {t('registration.hint.password.nomatch')}
                    </Typography>
                )}
            </div>

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
