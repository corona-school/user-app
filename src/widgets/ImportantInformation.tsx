import { useTranslation } from 'react-i18next';
import { Box, Heading, Text, Button, HStack, useTheme, ScrollView } from 'native-base';
import Card from '../components/Card';
import BooksIcon from '../assets/icons/lernfair/lf-books.svg';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../gql';

type Props = {
    variant?: 'normal' | 'dark';
};

const ImportantInformation: React.FC<Props> = ({ variant }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const textColor = variant === 'dark' ? 'lightText' : 'darkText';

    const { data } = useQuery(
        gql(`
		query GetOnboardingInfos {
          me {
            email
            secrets {
              type
            }
            student {
              createdAt
              verifiedAt
              firstMatchRequest
              openMatchRequestCount
              certificateOfConduct {
                id
              }
              canRequestMatch {
                allowed
                reason
              }
              canCreateCourse {
                allowed
                reason
              }
            }
            pupil {
              createdAt
              verifiedAt
              firstMatchRequest
			  openMatchRequestCount
              tutoringInterestConfirmation {
                id
                status
              }
            }
          }
		}
		`)
    );

    const [sendVerificationMail] = useMutation(
        gql(`mutation SendVerificationMail($email: String!) { tokenRequest(email:$email action: "user-verify-email" redirectTo: "/dashboard") }`),
        { variables: { email: data?.me?.email || 'email never empty' } }
    );
    const [confirmInterest] = useMutation(gql(`mutation Confirm($token: String!){ tutoringInterestConfirm(token:$token) }`), { variables: { token: 'TODO' } });
    const [refuseInterest] = useMutation(gql(`mutation Refuse($token: String!){ tutoringInterestRefuse(token:$token) }`), { variables: { token: 'TODO' } });

    let infos = [];
    if (!data?.me?.student?.verifiedAt) infos.push({ label: 'verifizierung', btnfn: [sendVerificationMail] });
    if (!data?.me?.student?.firstMatchRequest && !data?.me?.pupil) infos.push({ label: 'kennenlernen', btnfn: [] });
    if (!data?.me?.pupil?.firstMatchRequest && !data?.me?.student) infos.push({ label: 'willkommen', btnfn: [] });
    if (data?.me?.pupil?.openMatchRequestCount && data?.me?.pupil?.openMatchRequestCount > 0) infos.push({ label: 'statusSchüler', btnfn: [] });
    if (data?.me?.student?.openMatchRequestCount && data?.me?.student?.openMatchRequestCount > 0)
        infos.push({ label: 'statusStudent', btnfn: [() => (window.location.href = 'mailto:support@lern-fair.de')] });
    if (!data?.me?.secrets?.some((secret: any) => secret.type === 'PASSWORD')) infos.push({ label: 'passwort', btnfn: [] });
    if (data?.me?.pupil?.tutoringInterestConfirmation?.status && data?.me?.pupil?.tutoringInterestConfirmation?.status === 'pending')
        infos.push({ label: 'interestconformation', btnfn: [confirmInterest, refuseInterest] });
    if (!data?.me?.student) infos.push({ label: 'kontaktSchüler', btnfn: [] });
    if (!data?.me?.student) infos.push({ label: 'angeforderteBescheinigung', btnfn: [] });
    if (!data?.me?.pupil) infos.push({ label: 'kontaktStudent', btnfn: [] });
    if (!data?.me?.pupil && !data?.me?.student?.certificateOfConduct?.id)
        infos.push({ label: 'zeugnis', btnfn: [() => (window.location.href = 'mailto:fz@lern-fair.de')] });

    const importantInformationCards = infos.map((config, index) => {
        const buttontexts: String[] = t('helperwizard.' + config.label + '.buttons', { returnObjects: true });
        const buttons = buttontexts.map((buttontext, index) => {
            return (
                <Button onPress={() => config.btnfn[index]()} key={index} marginBottom={'5px'}>
                    {buttontext}
                </Button>
            );
        });
        return (
            <Card flexibleWidth={true} padding={5} variant={variant} key={index}>
                <Box marginBottom="20px">
                    <BooksIcon />
                </Box>
                <Heading color={textColor} fontSize="lg" marginBottom="17px">
                    {t('helperwizard.' + config.label + '.title')}
                </Heading>

                <Text color={textColor} marginBottom="25px">
                    {t('helperwizard.' + config.label + '.content')}
                </Text>
                {buttons}
            </Card>
        );
    });
    return (
        <Box marginBottom={'25px'}>
            {infos.length > 0 && (
                <Heading fontSize="lg" marginBottom="17px">
                    {t('helperwizard.nextStep')}
                </Heading>
            )}
            <ScrollView>
                <HStack space={space['0.5']}>{importantInformationCards}</HStack>
            </ScrollView>
        </Box>
    );
};
export default ImportantInformation;
