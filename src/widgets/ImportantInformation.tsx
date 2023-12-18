import { useTranslation, getI18n } from 'react-i18next';
import { Box, useTheme } from 'native-base';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '../gql';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import HSection from './HSection';
import { BACKEND_URL } from '../config';
import { useEffect, useMemo, useState } from 'react';
import useModal from '../hooks/useModal';
import { ConfirmCertificate } from './certificates/ConfirmCertificate';
import { SuccessModal } from '../modals/SuccessModal';
import NextStepsCard from '../components/achievements/nextStepsCard/NextStepsCard';
import { Achievement_Action_Type_Enum } from '../gql/graphql';
import { Achievement } from '../types/achievement';
import AchievementModal from '../components/achievements/modals/AchievementModal';
import { TypeofAchievementQuery, convertDataToAchievement } from '../helper/achievement-helper';
import NextStepModal from '../components/achievements/modals/NextStepModal';

type Props = {
    variant?: 'normal' | 'dark';
};

type Information = {
    label: string;
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
    nextStepAchievements {
        id
        name
        subtitle
        description
        image
        alternativeText
        actionType
        achievementType
        achievementState
        steps {
            name
            isActive
        }
        maxSteps
        currentStep
        isNewAchievement
        progressDescription
        actionName
        actionRedirectLink
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
    const achievements = convertDataToAchievement({ data, type: TypeofAchievementQuery.nextStepAchievements });
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
                    btnfn: [() => (window.location.href = 'mailto:' + match.studentEmail), () => navigate('/matching')],
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

    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | undefined>();
    const [selectedInformation, setSelectedInformation] = useState<Information>();

    if (!infos.length && !configurableInfos.length) return null;

    return (
        <Box>
            {selectedAchievement && (
                <AchievementModal
                    title={selectedAchievement.subtitle}
                    name={selectedAchievement.name}
                    description={selectedAchievement.description}
                    achievementState={selectedAchievement.achievementState}
                    achievementType={selectedAchievement.achievementType}
                    isNewAchievement={selectedAchievement.isNewAchievement}
                    steps={selectedAchievement.steps}
                    maxSteps={selectedAchievement.maxSteps}
                    currentStep={selectedAchievement.currentStep}
                    progressDescription={selectedAchievement.progressDescription}
                    image={selectedAchievement.image}
                    alternativeText={selectedAchievement.alternativeText}
                    buttonText={selectedAchievement.actionName}
                    buttonLink={selectedAchievement.actionRedirectLink}
                    onClose={() => setSelectedAchievement(undefined)}
                    showModal={selectedAchievement !== undefined}
                />
            )}
            {selectedInformation && (
                <NextStepModal
                    header={t(`helperwizard.${selectedInformation.label}.title` as unknown as TemplateStringsArray, selectedInformation.lang)}
                    title={`${t('important')}!`}
                    description={t(`helperwizard.${selectedInformation.label}.content` as unknown as TemplateStringsArray, selectedInformation.lang)}
                    buttons={selectedInformation.btntxt?.map((txt, index) => ({
                        label: txt,
                        btnfn: selectedInformation.btnfn[index],
                    }))}
                    isOpen={selectedInformation !== undefined}
                    onClose={() => setSelectedInformation(undefined)}
                />
            )}
            <HSection
                scrollable
                title={t('helperwizard.nextStep')}
                referenceTitle={t('helperwizard.progress')}
                marginBottom="25px"
                onShowAll={() => navigate('/progress')}
                showAll
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
                    const actionDescription =
                        t(`helperwizard.${config.label}.actionDescription` as unknown as TemplateStringsArray, config.lang) || t('moreInfoButton');
                    return (
                        <NextStepsCard
                            key={`${config.label}-${index}`}
                            title={`${t('important')}!`}
                            name={t(`helperwizard.${config.label}.title` as unknown as TemplateStringsArray, config.lang)}
                            description={t(`helperwizard.${config.label}.content` as unknown as TemplateStringsArray, config.lang)}
                            actionDescription={actionDescription}
                            actionType={Achievement_Action_Type_Enum.Action}
                            onClick={() => setSelectedInformation({ ...config, btntxt: buttontexts })}
                        />
                    );
                })}
                {achievements.map((achievement) => {
                    return (
                        <NextStepsCard
                            key={achievement.id}
                            image={achievement.image}
                            title={achievement.name}
                            name={achievement.subtitle}
                            actionDescription={achievement.actionName || ''}
                            actionType={achievement.actionType || Achievement_Action_Type_Enum.Action}
                            maxSteps={achievement.maxSteps}
                            currentStep={achievement.currentStep}
                            onClick={() => {
                                setSelectedAchievement(achievement);
                            }}
                        />
                    );
                })}
            </HSection>
        </Box>
    );
};
export default ImportantInformation;
