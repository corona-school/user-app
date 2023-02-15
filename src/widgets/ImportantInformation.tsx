import { useTranslation, getI18n } from 'react-i18next';
import { Box, Heading, Text, Button, HStack, useTheme, ScrollView, Column } from 'native-base';
import Card from '../components/Card';
import BooksIcon from '../assets/icons/lernfair/lf-books.svg';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../gql';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import HSection from './HSection';
import { BACKEND_URL } from '../config';

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
              certificateOfConductDeactivationDate
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
              subcoursesJoined {
                  id
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
          myRoles
		}
		`)
    );

    const pupil = data?.me?.pupil;
    const student = data?.me?.student;
    const email = data?.me?.email;
    const roles = data?.myRoles ?? [];

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

    const [downloadRemissionRequest] = useMutation(gql(`mutation DownloadRemissionRequest { studentGetRemissionRequestAsPDF }`));
    async function openRemissionRequest() {
        const { data } = await downloadRemissionRequest();
        window.open(BACKEND_URL + data!.studentGetRemissionRequestAsPDF, '_blank');
    }

    let infos: { label: string; btnfn: ((() => void) | null)[]; lang: {} }[] = [];

    // -------- Verification -----------
    if (student && !student?.verifiedAt)
        infos.push({ label: 'verifizierung', btnfn: [sendMail], lang: { date: DateTime.fromISO(student?.createdAt).toFormat('dd.MM.yyyy'), email: email } });
    if (pupil && !pupil?.verifiedAt)
        infos.push({ label: 'verifizierung', btnfn: [sendMail], lang: { date: DateTime.fromISO(pupil?.createdAt).toFormat('dd.MM.yyyy'), email: email } });

    // -------- Screening -----------
    if (
        student?.canRequestMatch?.reason === 'not-screened' ||
        student?.canCreateCourse?.reason === 'not-screened' ||
        (student?.canCreateCourse?.reason === 'not-instructor' && student.canRequestMatch?.reason === 'not-tutor')
    )
        infos.push({ label: 'kennenlernen', btnfn: [() => window.open(process.env.REACT_APP_SCREENING_URL)], lang: {} });

    // -------- Welcome -----------
    if (pupil && !pupil?.firstMatchRequest && pupil?.subcoursesJoined.length === 0 && pupil?.matches.length === 0)
        infos.push({
            label: 'willkommen',
            btnfn: [roles.includes('PARTICIPANT') ? () => navigate('/group') : null, roles.includes('TUTEE') ? () => navigate('/matching') : null],
            lang: {},
        });

    // -------- Open Match Request -----------
    if (roles.includes('TUTEE') && (pupil?.openMatchRequestCount ?? 0) > 0)
        infos.push({
            label: 'statusSchüler',
            btnfn: [() => navigate('/group'), deleteMatchRequest],
            lang: { date: DateTime.fromISO(pupil?.firstMatchRequest).toFormat('dd.MM.yyyy') },
        });
    if (roles.includes('TUTOR') && (student?.openMatchRequestCount ?? 0) > 0)
        infos.push({ label: 'statusStudent', btnfn: [() => (window.location.href = 'mailto:support@lern-fair.de')], lang: {} });

    // -------- Password Login Promotion -----------
    if (data && !data?.me?.secrets?.some((secret: any) => secret.type === 'PASSWORD'))
        infos.push({ label: 'passwort', btnfn: [() => navigate('/reset-password')], lang: {} });

    // -------- Interest Confirmation -----------
    const formatter = new Intl.ListFormat(getI18n().language, { style: 'long', type: 'conjunction' });
    if (pupil?.tutoringInterestConfirmation?.status && pupil?.tutoringInterestConfirmation?.status === 'pending')
        infos.push({
            label: 'interestconfirmation',
            btnfn: [confirmInterest, refuseInterest],
            lang: { subjectSchüler: formatter.format(pupil?.subjectsFormatted.map((subject: any) => subject.name) || 'in keinem Fach') },
        });

    // -------- New Match -----------
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

    // -------- Certificate of Conduct -----------
    if (student && student?.certificateOfConductDeactivationDate)
        infos.push({
            label: 'zeugnis',
            btnfn: [() => (window.location.href = 'mailto:fz@lern-fair.de'), openRemissionRequest],
            lang: {
                cocDate: DateTime.fromISO(student?.certificateOfConductDeactivationDate).toFormat('dd.MM.yyyy'),
            },
        });
    // if (!data?.me?.student) infos.push({ label: 'angeforderteBescheinigung', btnfn: [], lang: {} });

    if (!infos.length) return null;

    return (
        <HSection scrollable title={t('helperwizard.nextStep')} marginBottom="25px">
            {infos.map((config, index) => {
                const buttontexts: String[] = t(`helperwizard.${config.label}.buttons` as unknown as TemplateStringsArray, { returnObjects: true });
                return (
                    <Column width="100%" maxWidth="500px">
                        <Card flexibleWidth={true} padding={5} variant={variant} key={index}>
                            <Box marginBottom="20px">
                                <BooksIcon />
                            </Box>
                            <Heading color={textColor} fontSize="lg" marginBottom="17px">
                                {t(`helperwizard.${config.label}.title` as unknown as TemplateStringsArray, config.lang)}
                            </Heading>

                            <Text color={textColor} marginBottom="25px">
                                {t(`helperwizard.${config.label}.content` as unknown as TemplateStringsArray, config.lang)}
                            </Text>
                            {buttontexts.map((buttontext, index) => {
                                const btnFn = config.btnfn[index];
                                if (!btnFn) return null;

                                return (
                                    <Button disabled={!btnFn} onPress={() => btnFn()} key={index} marginBottom={'5px'}>
                                        {buttontext}
                                    </Button>
                                );
                            })}
                        </Card>
                    </Column>
                );
            })}
        </HSection>
    );
};
export default ImportantInformation;
