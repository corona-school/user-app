import { useTranslation, getI18n } from 'react-i18next';
import { Box, useTheme } from 'native-base';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../gql';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import HSection from './HSection';
import { BACKEND_URL, GAMIFICATION_ACTIVE } from '../config';
import { useEffect, useMemo, useState } from 'react';
import useModal from '../hooks/useModal';
import { SuccessModal } from '../modals/SuccessModal';
import NextStepsCard from '../components/achievements/nextStepsCard/NextStepsCard';
import { Achievement, Achievement_Action_Type_Enum, Achievement_State, Achievement_Type_Enum } from '../gql/graphql';
import { PuzzlePieceType, getPuzzleEmptyState } from '../helper/achievement-helper';
import AchievementModal from '../components/achievements/modals/AchievementModal';
import NextStepModal from '../components/achievements/modals/NextStepModal';
import { NextStepLabelType } from '../helper/important-information-helper';

type Props = {
    variant?: 'normal' | 'dark';
};

type Information = {
    label: NextStepLabelType;
    btnfn: ((() => void) | null)[];
    lang: {};
    btntxt?: string[];
    key?: string;
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
      subcoursesInstructing {
        id
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
        id
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
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const textColor = variant === 'dark' ? 'lightText' : 'darkText';

    const { show, hide } = useModal();

    const { data } = useQuery(IMPORTANT_INFORMATION_QUERY);

    const [selectedInformation, setSelectedInformation] = useState<Information>();

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
        let infos: Information[] = [];

        // -------- Verification -----------
        if (student && !student?.verifiedAt)
            infos.push({
                label: NextStepLabelType.VERIFY,
                btnfn: [sendMail],
                lang: { date: DateTime.fromISO(student?.createdAt).toFormat('dd.MM.yyyy'), email: email },
            });
        if (pupil && !pupil?.verifiedAt)
            infos.push({
                label: NextStepLabelType.VERIFY,
                btnfn: [sendMail],
                lang: { date: DateTime.fromISO(pupil?.createdAt).toFormat('dd.MM.yyyy'), email: email },
            });

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
            infos.push({ label: NextStepLabelType.GET_FAMILIAR, btnfn: [() => window.open(student_url)], lang: {} });
        }

        // -------- Pupil Screening --------
        const wasInvited = pupil?.screenings.some((s) => !s.invalidated && s.status === 'pending');
        const notYetScreened = !roles.includes('TUTEE') && !roles.includes('PARTICIPANT');
        if (pupil && (wasInvited || notYetScreened)) {
            const pupil_url =
                (notYetScreened ? process.env.REACT_APP_PUPIL_FIRST_SCREENING_URL : process.env.REACT_APP_PUPIL_SCREENING_URL) +
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
                label: notYetScreened ? NextStepLabelType.PUPIL_FIRST_SCREENING : NextStepLabelType.PUPIL_SCREENING,
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
                label: NextStepLabelType.WELCOME,
                btnfn: [roles.includes('PARTICIPANT') ? () => navigate('/group') : null, roles.includes('TUTEE') ? () => navigate('/matching') : null],
                lang: {},
            });

        // -------- Interest Confirmation -----------
        const showInterestConfirmation = pupil?.tutoringInterestConfirmation?.status && pupil?.tutoringInterestConfirmation?.status === 'pending';
        // TODO: Browser Support?
        // const formatter = new Intl.ListFormat(getI18n().language, { style: 'long', type: 'conjunction' });
        if (showInterestConfirmation)
            infos.push({
                label: NextStepLabelType.INTEREST_CONFIRMATION,
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
                label: NextStepLabelType.STATUS_PUPIL,
                btnfn: [() => navigate('/group'), deleteMatchRequest],
                lang: { date: DateTime.fromISO(pupil?.firstMatchRequest ?? pupil?.createdAt).toFormat('dd.MM.yyyy') },
            });
        if (roles.includes('TUTOR') && (student?.openMatchRequestCount ?? 0) > 0)
            infos.push({ label: NextStepLabelType.STATUS_STUDENT, btnfn: [() => (window.location.href = 'mailto:support@lern-fair.de')], lang: {} });

        if (roles.includes('TUTOR') && (student?.openMatchRequestCount ?? 0) > 0)
            infos.push({
                label: NextStepLabelType.STATUS_STUDENT_TWO,
                btnfn: [() => navigate('/matching'), roles.includes('INSTRUCTOR') ? () => navigate('/group') : null],
                lang: {},
            });
        // -------- Password Login Promotion -----------
        if (data && !data?.me?.secrets?.some((secret: any) => secret.type === 'PASSWORD'))
            infos.push({ label: NextStepLabelType.PASSWORD, btnfn: [() => navigate('/new-password')], lang: {} });

        // -------- New Match -----------
        pupil?.matches?.forEach((match) => {
            if (!match.dissolved && match.createdAt > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000))
                infos.push({
                    label: NextStepLabelType.CONTACT_PUPIL,
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
                    label: NextStepLabelType.CONTACT_STUDENT,
                    btnfn: [() => navigate('/matching')],
                    lang: { nameSchüler: match.pupil.firstname },
                });
        });

        // -------- Certificate of Conduct -----------
        if (student && student?.certificateOfConductDeactivationDate)
            infos.push({
                label: NextStepLabelType.SCHOOL_CERTIFICATE,
                btnfn: [() => (window.location.href = 'mailto:fz@lern-fair.de'), openRemissionRequest],
                lang: {
                    cocDate: DateTime.fromISO(student?.certificateOfConductDeactivationDate).toFormat('dd.MM.yyyy'),
                },
            });

        // -------- Confirm Tutoring Certificate -----
        for (const certificate of data?.me.pupil?.participationCertificatesToSign.filter((it) => it.state === 'awaiting-approval') ?? []) {
            infos.push({
                label: NextStepLabelType.TUTORING_CERTIFICATE,
                btnfn: [() => navigate(`/confirm-certificate/${certificate.id}`)],
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
    }, [student, sendMail, email, pupil, roles, confirmInterest, refuseInterest, deleteMatchRequest, data, openRemissionRequest, navigate]);

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
        <Box>
            {selectedInformation && (
                <NextStepModal
                    header={t(`helperwizard.${selectedInformation.label}.title` as unknown as TemplateStringsArray, selectedInformation.lang)}
                    title={`${t('important')}!`}
                    description={t(`helperwizard.${selectedInformation.label}.content` as unknown as TemplateStringsArray, selectedInformation.lang)}
                    isOpen={selectedInformation !== undefined}
                    label={selectedInformation.label}
                    onClose={() => setSelectedInformation(undefined)}
                    buttons={
                        selectedInformation.btnfn?.length > 0
                            ? selectedInformation.btntxt?.map((txt, index) => ({
                                  label: txt,
                                  btnfn: selectedInformation.btnfn ? selectedInformation.btnfn[index] : () => null,
                              }))
                            : []
                    }
                />
            )}
            <HSection
                scrollable
                title={t('helperwizard.nextStep')}
                referenceTitle={t('helperwizard.progress')}
                marginBottom="25px"
                onShowAll={() => navigate('/progress')}
                showAll={GAMIFICATION_ACTIVE}
            >
                {configurableInfos.map((info, index) => {
                    return (
                        <NextStepsCard
                            key={index}
                            title={`${t('important')}!`}
                            name={info.title}
                            description={info.desciption}
                            actionDescription={t('moreInfoButton')}
                            actionType={Achievement_Action_Type_Enum.Action}
                            onClick={() => {
                                info.btnfn && info.btnfn();
                            }}
                        />
                    );
                })}
                {infos.map((config, index) => {
                    const buttontexts: string[] = t(`helperwizard.${config.label}.buttons` as unknown as TemplateStringsArray, { returnObjects: true });
                    const actionDescription = i18n.exists(`helperwizard.${config.label}.actionDescription`)
                        ? t(`helperwizard.${config.label}.actionDescription` as unknown as TemplateStringsArray, config.lang)
                        : t('moreInfoButton');
                    return (
                        <NextStepsCard
                            key={`${config.label}-${index}`}
                            label={config.label}
                            title={t(`helperwizard.${config.label}.subtitle` as unknown as TemplateStringsArray, config.lang)}
                            name={t(`helperwizard.${config.label}.title` as unknown as TemplateStringsArray, config.lang)}
                            description={t(`helperwizard.${config.label}.content` as unknown as TemplateStringsArray, config.lang)}
                            actionDescription={actionDescription}
                            actionType={Achievement_Action_Type_Enum.Action}
                            onClick={() => setSelectedInformation({ ...config, btntxt: buttontexts })}
                        />
                    );
                })}
            </HSection>
        </Box>
    );
};
export default ImportantInformation;
