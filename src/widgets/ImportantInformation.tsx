import { useTranslation, getI18n } from 'react-i18next';
import { Box, Heading, Text, Button, HStack, useTheme, ScrollView } from 'native-base';
import Card from '../components/Card';
import BooksIcon from '../assets/icons/lernfair/lf-books.svg';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../gql';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';

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
				pupilEmail
				pupil {
				  firstname
				  lastname
				}
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
			  subjectsFormatted {
				name
			  }
			  matches {
				dissolved
				createdAt
				studentEmail
				subjectsFormatted {
				  name
				}
				student {
				  firstname
				  lastname
				}
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

    const pupil = data?.me?.pupil;
    const student = data?.me?.student;
    const email = data?.me?.email;

    const [sendMail] = useMutation(
        gql(`mutation SendVerificationMail($email: String!) { tokenRequest(email:$email action: "user-verify-email" redirectTo: "/dashboard") }`),
        { variables: { email: email || 'email never empty' } }
    );
    const [confirmInterest] = useMutation(gql(`mutation Confirm($token: String!){ tutoringInterestConfirm(token:$token) }`), {
        variables: { token: pupil?.tutoringInterestConfirmation?.token || 'token never empty' },
    });
    const [refuseInterest] = useMutation(gql(`mutation Refuse($token: String!){ tutoringInterestRefuse(token:$token) }`), {
        variables: { token: pupil?.tutoringInterestConfirmation?.token || 'token never empty' },
    });
    const [deleteMatchRequest] = useMutation(gql(`mutation deleteMatchRequest{ pupilDeleteMatchRequest }`));

    let infos: { label: string; btnfn: (() => void)[]; lang: {} }[] = [];
    if (student && !student?.verifiedAt)
        infos.push({ label: 'verifizierung', btnfn: [sendMail], lang: { date: DateTime.fromISO(student?.createdAt).toFormat('dd.MM.yyyy'), email: email } });
    if (pupil && !pupil?.verifiedAt)
        infos.push({ label: 'verifizierung', btnfn: [sendMail], lang: { date: DateTime.fromISO(pupil?.createdAt).toFormat('dd.MM.yyyy'), email: email } });
    if (student?.canRequestMatch?.reason === 'not-screened' || student?.canCreateCourse?.reason === 'not-screened')
        infos.push({ label: 'kennenlernen', btnfn: [], lang: {} });
    if (!pupil?.firstMatchRequest && !data?.me?.student)
        infos.push({ label: 'willkommen', btnfn: [() => navigate('/group'), () => navigate('/matching')], lang: {} });
    if (pupil?.openMatchRequestCount && pupil?.openMatchRequestCount > 0)
        infos.push({
            label: 'statusSchüler',
            btnfn: [() => navigate('/group'), deleteMatchRequest],
            lang: { date: DateTime.fromISO(pupil?.firstMatchRequest).toFormat('dd.MM.yyyy') },
        });
    if (student?.openMatchRequestCount && student?.openMatchRequestCount > 0)
        infos.push({ label: 'statusStudent', btnfn: [() => (window.location.href = 'mailto:support@lern-fair.de')], lang: {} });
    if (!data?.me?.secrets?.some((secret: any) => secret.type === 'PASSWORD'))
        infos.push({ label: 'passwort', btnfn: [() => navigate('/reset-password')], lang: {} });
    const formatter = new Intl.ListFormat(getI18n().language, { style: 'long', type: 'conjunction' });
    if (pupil?.tutoringInterestConfirmation?.status && pupil?.tutoringInterestConfirmation?.status === 'pending')
        infos.push({
            label: 'interestconformation',
            btnfn: [confirmInterest, refuseInterest],
            lang: { subjectSchüler: formatter.format(pupil?.subjectsFormatted.map((subject: any) => subject.name) || 'subject never empty') },
        });
    pupil?.matches?.forEach((match: any) => {
        if (!match.dissolved && match.createdAt > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000))
            infos.push({
                label: 'kontaktSchüler',
                btnfn: [() => (window.location.href = 'mailto:' + match.studentEmail), () => navigate('/matching')],
                lang: { nameHelfer: match.student.firstname, subjectHelfer: formatter.format(match.subjectsFormatted.map((subject: any) => subject.name)) },
            });
    });
    student?.matches?.forEach((match: any) => {
        if (!match.dissolved && match.createdAt > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000))
            infos.push({
                label: 'kontaktStudent',
                btnfn: [() => (window.location.href = 'mailto:' + match.pupilEmail), () => navigate('/matching')],
                lang: { nameSchüler: match.pupil.firstname },
            });
    });
    if (!pupil && !student?.certificateOfConduct?.id)
        infos.push({ label: 'zeugnis', btnfn: [() => (window.location.href = 'mailto:fz@lern-fair.de')], lang: {} });
    // if (!data?.me?.student) infos.push({ label: 'angeforderteBescheinigung', btnfn: [], lang: {} });

    return (
        <Box marginBottom={'25px'}>
            {infos.length > 0 && (
                <Heading fontSize="lg" marginBottom="17px">
                    {t('helperwizard.nextStep')}
                </Heading>
            )}
            <ScrollView>
                <HStack space={space['0.5']}>
                    {infos.map((config, index) => {
                        const buttontexts: String[] = t('helperwizard.' + config.label + '.buttons', { returnObjects: true });
                        return (
                            <Card flexibleWidth={true} padding={5} variant={variant} key={index}>
                                <Box marginBottom="20px">
                                    <BooksIcon />
                                </Box>
                                <Heading color={textColor} fontSize="lg" marginBottom="17px">
                                    {t('helperwizard.' + config.label + '.title', config.lang)}
                                </Heading>

                                <Text color={textColor} marginBottom="25px">
                                    {t('helperwizard.' + config.label + '.content', config.lang)}
                                </Text>
                                {buttontexts.map((buttontext, index) => {
                                    return (
                                        <Button onPress={() => config.btnfn[index]()} key={index} marginBottom={'5px'}>
                                            {buttontext}
                                        </Button>
                                    );
                                })}
                            </Card>
                        );
                    })}
                </HStack>
            </ScrollView>
        </Box>
    );
};
export default ImportantInformation;
