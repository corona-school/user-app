import { useTranslation, getI18n, Trans } from 'react-i18next';
import { Box, Heading, Text, Button, HStack, useTheme, ScrollView, Column, Container } from 'native-base';
import Card from '../components/Card';
import BooksIcon from '../assets/icons/lernfair/lf-books.svg';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../gql';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import HSection from './HSection';
import { BACKEND_URL } from '../config';
import { useContext, useEffect, useMemo, useState } from 'react';
import useModal from '../hooks/useModal';
import { ConfirmCertificate } from './certificates/ConfirmCertificate';
import { SuccessModal } from '../modals/SuccessModal';

type Props = {
    variant?: 'normal' | 'dark';
};

export const IMPORTANT_INFORMATION_QUERY = gql(`
query GetOnboardingInfos {
  important_informations {
    title
    description
    navigateTo
    language
    recipients
  }
  me {
    email
    firstname
    lastname
    secrets {
      type
    }
    student {
      createdAt
      verifiedAt
      matches {
        dissolved
        createdAt
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
      grade
      subjectsFormatted {
        name
      }
      subcoursesJoined {
          id
      }
      matches {
        dissolved
        createdAt
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
      participationCertificatesToSign {
         uuid
         ongoingLessons
         state
         categories
         startDate
         endDate
         hoursPerWeek
         hoursTotal
         medium
         student { firstname lastname }
      }
      screenings {
         invalidated
         status
      }
    }
  }
  myRoles
}
`);

const ImportantInformation: React.FC<Props> = ({ variant }) => {
    const { space } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const textColor = variant === 'dark' ? 'lightText' : 'darkText';

    const { show, hide } = useModal();

    const { data } = useQuery(IMPORTANT_INFORMATION_QUERY);

    const pupil = data?.me?.pupil;
    const student = data?.me?.student;
    const email = data?.me?.email;
    const roles = data?.myRoles ?? [];
    const importantInformations = data?.important_informations ?? [];

    const [sendMail] = useMutation(
        gql(`mutation SendVerificationMail($email: String!) { tokenRequest(email:$email action: "user-verify-email" redirectTo: "/dashboard") }`),
        { variables: { email: email || 'email never empty' }, refetchQueries: [IMPORTANT_INFORMATION_QUERY] }
    );
    const [confirmInterest, { data: confirmedInterest }] = useMutation(gql(`mutation Confirm($token: String!){ tutoringInterestConfirm(token:$token) }`), {
        variables: { token: pupil?.tutoringInterestConfirmation?.token || 'token never empty' },
        refetchQueries: [IMPORTANT_INFORMATION_QUERY],
    });

    useEffect(() => {
        if (confirmedInterest) {
            show({ variant: 'dark', closeable: true }, <SuccessModal title="Interesse bestätigt!" content="Wir melden uns bald wieder!" />);
        }
    }, [show, confirmedInterest]);

    const [refuseInterest, { data: refusedInterest }] = useMutation(gql(`mutation Refuse($token: String!){ tutoringInterestRefuse(token:$token) }`), {
        variables: { token: pupil?.tutoringInterestConfirmation?.token || 'token never empty' },
        refetchQueries: [IMPORTANT_INFORMATION_QUERY],
    });

    useEffect(() => {
        if (refusedInterest) {
            show(
                { variant: 'dark', closeable: true },
                <SuccessModal title="Danke für deine Antwort!" content="Durch deine Antwort können wir Anderen schneller Hilfe vermitteln" />
            );
        }
    }, [show, refusedInterest]);

    const [deleteMatchRequest] = useMutation(gql(`mutation deleteMatchRequest{ pupilDeleteMatchRequest }`), { refetchQueries: [IMPORTANT_INFORMATION_QUERY] });

    const [downloadRemissionRequest] = useMutation(gql(`mutation DownloadRemissionRequest { studentGetRemissionRequestAsPDF }`), {
        refetchQueries: [IMPORTANT_INFORMATION_QUERY],
    });
    async function openRemissionRequest() {
        const { data } = await downloadRemissionRequest();
        window.open(BACKEND_URL + data!.studentGetRemissionRequestAsPDF, '_blank');
    }

    const infos = useMemo(() => {
        let infos: { label: string; btnfn: ((() => void) | null)[]; lang: {}; key?: string }[] = [];

        // -------- Verification -----------
        if (student && !student?.verifiedAt)
            infos.push({
                label: 'verifizierung',
                btnfn: [sendMail],
                lang: { date: DateTime.fromISO(student?.createdAt).toFormat('dd.MM.yyyy'), email: email },
            });
        if (pupil && !pupil?.verifiedAt)
            infos.push({ label: 'verifizierung', btnfn: [sendMail], lang: { date: DateTime.fromISO(pupil?.createdAt).toFormat('dd.MM.yyyy'), email: email } });

        // -------- Screening -----------
        if (
            student?.canRequestMatch?.reason === 'not-screened' ||
            student?.canCreateCourse?.reason === 'not-screened' ||
            (student?.canCreateCourse?.reason === 'not-instructor' && student.canRequestMatch?.reason === 'not-tutor')
        ) {
            const student_url =
                process.env.REACT_APP_SCREENING_URL +
                '?first_name=' +
                encodeURIComponent(data?.me?.firstname ?? '') +
                '&last_name=' +
                encodeURIComponent(data?.me?.lastname ?? '') +
                '&email=' +
                encodeURIComponent(email ?? '');
            infos.push({ label: 'kennenlernen', btnfn: [() => window.open(student_url)], lang: {} });
        }

        // -------- Pupil Screening --------
        if (pupil?.screenings.some((s) => !s.invalidated && s.status === 'pending')) {
            const pupil_url =
                process.env.REACT_APP_PUPIL_SCREENING_URL +
                '?first_name=' +
                encodeURIComponent(data?.me?.firstname ?? '') +
                '&last_name=' +
                encodeURIComponent(data?.me?.lastname ?? '') +
                '&email=' +
                encodeURIComponent(email ?? '') +
                '&a1=' +
                encodeURIComponent(pupil?.grade ?? '') +
                '&a2=' +
                encodeURIComponent(pupil?.subjectsFormatted.map((it) => it.name).join(', ') ?? '');
            infos.push({
                label: 'pupilScreening',
                btnfn: [
                    () => {
                        window.open(pupil_url, '_blank');
                    },
                ],
                lang: {},
            });
        }
        // -------- Welcome -----------
        if (pupil && !pupil?.firstMatchRequest && pupil?.subcoursesJoined.length === 0 && pupil?.matches.length === 0)
            infos.push({
                label: 'willkommen',
                btnfn: [roles.includes('PARTICIPANT') ? () => navigate('/group') : null, roles.includes('TUTEE') ? () => navigate('/matching') : null],
                lang: {},
            });

        // -------- Interest Confirmation -----------
        const showInterestConfirmation = pupil?.tutoringInterestConfirmation?.status && pupil?.tutoringInterestConfirmation?.status === 'pending';
        // TODO: Browser Support?
        // const formatter = new Intl.ListFormat(getI18n().language, { style: 'long', type: 'conjunction' });
        if (showInterestConfirmation)
            infos.push({
                label: 'interestconfirmation',
                btnfn: [confirmInterest, refuseInterest],
                lang: {
                    subjectSchüler:
                        /* formatter.format(pupil?.subjectsFormatted.map((subject: any) => subject.name) || 'in keinem Fach') */ pupil?.subjectsFormatted
                            .map((it) => it.name)
                            .join(', '),
                },
            });

        // -------- Open Match Request -----------
        if (roles.includes('TUTEE') && (pupil?.openMatchRequestCount ?? 0) > 0 && !showInterestConfirmation)
            infos.push({
                label: 'statusSchüler',
                btnfn: [() => navigate('/group'), deleteMatchRequest],
                lang: { date: DateTime.fromISO(pupil?.firstMatchRequest ?? pupil?.createdAt).toFormat('dd.MM.yyyy') },
            });
        if (roles.includes('TUTOR') && (student?.openMatchRequestCount ?? 0) > 0)
            infos.push({ label: 'statusStudent', btnfn: [() => (window.location.href = 'mailto:support@lern-fair.de')], lang: {} });

        if (roles.includes('TUTOR') && (student?.openMatchRequestCount ?? 0) > 0)
            infos.push({
                label: 'statusStudent2',
                btnfn: [() => navigate('/matching'), roles.includes('INSTRUCTOR') ? () => navigate('/group') : null],
                lang: {},
            });
        // -------- Password Login Promotion -----------
        if (data && !data?.me?.secrets?.some((secret: any) => secret.type === 'PASSWORD'))
            infos.push({ label: 'passwort', btnfn: [() => navigate('/new-password')], lang: {} });

        // -------- New Match -----------
        pupil?.matches?.forEach((match) => {
            if (!match.dissolved && match.createdAt > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000))
                infos.push({
                    label: 'kontaktSchüler',
                    btnfn: [() => navigate('/matching')],
                    lang: {
                        nameHelfer: match.student.firstname,
                        subjectHelfer: match.subjectsFormatted
                            .map((it) => it.name)
                            .join(', ') /* formatter.format(match.subjectsFormatted.map((subject: any) => subject.name)) */,
                    },
                });
        });
        student?.matches?.forEach((match: any) => {
            if (!match.dissolved && match.createdAt > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000))
                infos.push({
                    label: 'kontaktStudent',
                    btnfn: [() => navigate('/matching')],
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

        // -------- Confirm Tutoring Certificate -----
        for (const certificate of data?.me.pupil?.participationCertificatesToSign.filter((it) => it.state === 'awaiting-approval') ?? []) {
            infos.push({
                label: 'angeforderteBescheinigung',
                btnfn: [
                    () => {
                        show(
                            { variant: 'light', closeable: true, headline: t('matching.certificate.titleRequest') },
                            <ConfirmCertificate certificate={certificate} />
                        );
                    },
                ],
                lang: {
                    nameHelfer: certificate.student.firstname,
                    startDate: DateTime.fromISO(certificate.startDate).toFormat('dd.MM.yyyy'),
                    endDate: DateTime.fromISO(certificate.endDate).toFormat('dd.MM.yyyy'),
                    hoursPerWeek: certificate.hoursPerWeek,
                },
                key: `bescheinigung.${certificate.uuid}`,
            });
        }

        return infos;
    }, [student, sendMail, email, pupil, roles, deleteMatchRequest, data, confirmInterest, refuseInterest, openRemissionRequest, navigate, show, space]);

    const configurableInfos = useMemo(() => {
        let configurableInfos: { title: string; desciption: string; btnfn: (() => void) | null }[] = [];

        // -------- Configurable Important Information -----------
        importantInformations
            .filter(
                (info: any) =>
                    info.language.includes(getI18n().language) &&
                    ((pupil && info.recipients.includes('pupils')) || (student && info.recipients.includes('students')))
            )
            .forEach((info: any) => {
                configurableInfos.push({
                    title: info.title,
                    desciption: info.description,
                    btnfn: info.navigateTo
                        ? () => {
                              window.location.href = info.navigateTo;
                          }
                        : null,
                });
            });
        return configurableInfos;
    }, [importantInformations, pupil, student]);

    if (!infos.length && !configurableInfos.length) return null;

    return (
        <HSection scrollable title={t('helperwizard.nextStep')} marginBottom="25px">
            {configurableInfos.map((info, index) => {
                return (
                    <Column width="97%" maxWidth="500px">
                        <Card flexibleWidth={true} padding={5} variant={variant} key={index}>
                            <Box marginBottom="20px">
                                <BooksIcon />
                            </Box>
                            <Heading color={textColor} fontSize="lg" marginBottom="17px">
                                {info.title}
                            </Heading>
                            <Text color={textColor} marginBottom="25px">
                                {info.desciption}
                            </Text>
                            {info.btnfn && (
                                <Button
                                    onPress={() => {
                                        if (info.btnfn) info.btnfn();
                                    }}
                                    key={index}
                                    marginBottom={'5px'}
                                >
                                    {t('moreInfoButton')}
                                </Button>
                            )}
                        </Card>
                    </Column>
                );
            })}
            {infos.map((config, index) => {
                const buttontexts: String[] = t(`helperwizard.${config.label}.buttons` as unknown as TemplateStringsArray, { returnObjects: true });
                return (
                    <Column width="97%" maxWidth="500px" key={config.key ?? config.label}>
                        <Card flexibleWidth={true} padding={5} variant={variant} key={index}>
                            <Box marginBottom="20px">
                                <BooksIcon />
                            </Box>
                            <Heading color={textColor} fontSize="lg" marginBottom="17px">
                                {t(`helperwizard.${config.label}.title` as unknown as TemplateStringsArray, config.lang)}
                            </Heading>

                            <Text color={textColor} marginBottom="25px">
                                <Trans i18nKey={`helperwizard.${config.label}.content` as any} values={config.lang} components={{ b: <b />, br: <br /> }} />
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
