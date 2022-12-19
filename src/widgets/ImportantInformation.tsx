import { useTranslation } from 'react-i18next';
import { Box, Heading, Text, Button, HStack, useTheme, ScrollView } from 'native-base';
import Card from '../components/Card';
import BooksIcon from '../assets/icons/lernfair/lf-books.svg';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../gql';
import { useNavigate } from 'react-router-dom';

type Props = {
    variant?: 'normal' | 'dark';
};

const ImportantInformation: React.FC<Props> = ({ variant }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
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
			  matches {
				dissolved
				createdAt
			  }
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
			  matches {
				dissolved
				createdAt
			  }
              firstMatchRequest
			  openMatchRequestCount
              tutoringInterestConfirmation {
                id
				token
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
    const [confirmInterest] = useMutation(gql(`mutation Confirm($token: String!){ tutoringInterestConfirm(token:$token) }`), {
        variables: { token: data?.me?.pupil?.tutoringInterestConfirmation?.token || 'token never empty' },
    });
    const [refuseInterest] = useMutation(gql(`mutation Refuse($token: String!){ tutoringInterestRefuse(token:$token) }`), {
        variables: { token: data?.me?.pupil?.tutoringInterestConfirmation?.token || 'token never empty' },
    });

    let infos: { label: string; btnfn: (() => void)[] }[] = [];
    if (!data?.me?.student?.verifiedAt) infos.push({ label: 'verifizierung', btnfn: [sendVerificationMail] });
    if (data?.me?.student?.canRequestMatch?.reason === 'not-screened' || data?.me?.student?.canCreateCourse?.reason === 'not-screened')
        infos.push({ label: 'kennenlernen', btnfn: [] });
    if (!data?.me?.pupil?.firstMatchRequest && !data?.me?.student)
        infos.push({ label: 'willkommen', btnfn: [() => navigate('/group'), () => navigate('/matching')] });
    if (data?.me?.pupil?.openMatchRequestCount && data?.me?.pupil?.openMatchRequestCount > 0) infos.push({ label: 'statusSchüler', btnfn: [] });
    if (data?.me?.student?.openMatchRequestCount && data?.me?.student?.openMatchRequestCount > 0)
        infos.push({ label: 'statusStudent', btnfn: [() => (window.location.href = 'mailto:support@lern-fair.de')] });
    if (!data?.me?.secrets?.some((secret: any) => secret.type === 'PASSWORD')) infos.push({ label: 'passwort', btnfn: [() => navigate('/reset-password')] });
    if (data?.me?.pupil?.tutoringInterestConfirmation?.status && data?.me?.pupil?.tutoringInterestConfirmation?.status === 'pending')
        infos.push({ label: 'interestconformation', btnfn: [confirmInterest, refuseInterest] });
    // if (data?.me?.pupil?.matches.some((match: any) => !match.dissolved && match.createdAt > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)))
    infos.push({ label: 'kontaktSchüler', btnfn: [() => (window.location.href = 'mailto:support@lern-fair.de')] });
    if (data?.me?.student?.matches.some((match: any) => !match.dissolved && match.createdAt > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)))
        infos.push({ label: 'kontaktStudent', btnfn: [() => (window.location.href = 'mailto:support@lern-fair.de')] });
    if (!data?.me?.pupil && !data?.me?.student?.certificateOfConduct?.id)
        infos.push({ label: 'zeugnis', btnfn: [() => (window.location.href = 'mailto:fz@lern-fair.de')] });
    // if (!data?.me?.student) infos.push({ label: 'angeforderteBescheinigung', btnfn: [] });

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
