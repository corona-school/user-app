import { useMutation, useQuery } from '@apollo/client';
import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { createContext, Dispatch, SetStateAction, useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AsNavigationItem from '../../../components/AsNavigationItem';
import NotificationAlert from '../../../components/notifications/NotificationAlert';
import WithNavigation from '../../../components/WithNavigation';
import { gql } from '../../../gql';
import { Language, Subject } from '../../../gql/graphql';
import German from './German';
import Priority from './Priority';
import Subjects from './Subjects';
import UpdateData from './UpdateData';
import SwitchLanguageButton from '../../../components/SwitchLanguageButton';
import { Breadcrumb } from '@/components/Breadcrumb';
import InformationModal from '@/modals/InformationModal';
import { Typography } from '@/components/Typography';
import { useTranslation } from 'react-i18next';
import { ModalFooter } from '@/components/Modal';
import { Button } from '@/components/Button';
import { toast } from 'sonner';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';

const query = gql(`
    query PupilMatchRequestInfo {
        me {
            pupil {
                schooltype
                gradeAsInt
                state
                openMatchRequestCount
                subjectsFormatted { name mandatory }
                calendarPreferences
                languages
            }
        }
    }
`);

export type MatchRequest = {
    subjects: Subject[];
    message: string;
};

export enum RequestMatchStep {
    updateData = 'updateData',
    german = 'german',
    subjects = 'subjects',
    priority = 'priority',
}

type RequestMatchContextType = {
    matchRequest: MatchRequest;
    setSubject: (value: Subject) => void;
    removeSubject: (name: string) => void;
    setMessage: (message: string) => void;
    setSubjectPriority: (subjectName: string, mandatory: boolean) => void;
    setSkippedSubjectPriority: Dispatch<SetStateAction<boolean>>;
    skippedSubjectPriority: boolean;
    setSkippedSubjectList: Dispatch<SetStateAction<boolean>>;
    skippedSubjectList: boolean;
    isEdit: boolean;
    currentStep: RequestMatchStep;
    setCurrentStep: (step: RequestMatchStep) => void;
    requestMatch: () => Promise<void>;
};
export const RequestMatchContext = createContext<RequestMatchContextType>({
    matchRequest: { subjects: [], message: '' },
    setSubject: () => {},
    removeSubject: () => {},
    setMessage: () => {},
    setSubjectPriority: () => {},
    setSkippedSubjectPriority: () => null,
    skippedSubjectPriority: false,
    setSkippedSubjectList: () => null,
    skippedSubjectList: false,
    isEdit: false,
    currentStep: RequestMatchStep.updateData,
    setCurrentStep: () => {},
    requestMatch: () => Promise.resolve(),
});

const RequestMatch: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<RequestMatchStep>(RequestMatchStep.updateData);
    const [skippedSubjectPriority, setSkippedSubjectPriority] = useState<boolean>(false);
    const [skippedSubjectList, setSkippedSubjectList] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [matchRequest, setMatchRequest] = useState<MatchRequest>({
        subjects: [],
        message: '',
    });
    const setSubject = useCallback(
        (subject: Subject) =>
            setMatchRequest((prev) => {
                let exists = prev.subjects.some((it) => it.name === subject.name);
                return { ...prev, subjects: exists ? prev.subjects.map((it) => (it.name === subject.name ? subject : it)) : prev.subjects.concat(subject) };
            }),
        [setMatchRequest]
    );
    const removeSubject = useCallback(
        (subjectName: string) => setMatchRequest((prev) => ({ ...prev, subjects: prev.subjects.filter((it) => it.name !== subjectName) })),
        [setMatchRequest]
    );
    const setMessage = useCallback((message: string) => setMatchRequest((prev) => ({ ...prev, message })), [setMatchRequest]);

    const setSubjectPriority = useCallback(
        (subjectName: string, mandatory: boolean) => {
            setMatchRequest((prev) => ({
                ...prev,
                subjects: prev.subjects.map((subject) => (subject.name === subjectName ? { ...subject, mandatory } : subject)),
            }));
        },
        [setMatchRequest]
    );
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const location = useLocation();
    const locationState = location.state as { edit: boolean };
    const { trackPageView } = useMatomo();

    const [update, { loading: isUpdating }] = useMutation(
        gql(`
        mutation updatePupil($subjects: [SubjectInput!]) {
            meUpdate(update: { pupil: { subjects: $subjects } })
        }
    `)
    );

    const [createMatchRequest] = useMutation(
        gql(`
            mutation PupilCreateMatchRequest {
                pupilCreateMatchRequest
            }
        `)
    );

    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler Matching',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsEdit(locationState?.edit);
        if (locationState?.edit) {
            setCurrentStep(RequestMatchStep.updateData);
        }
        setIsLoading(false);
    }, [locationState]);

    const { data, loading } = useQuery(query);

    useEffect(() => {
        if (data)
            setMatchRequest({
                subjects: data.me.pupil!.subjectsFormatted.map((it) => ({ name: it.name, mandatory: it.mandatory })),
                message: '',
            });
    }, [data]);

    const requestMatch = useCallback(async () => {
        setIsLoading(true);
        const resSubs = await update({ variables: { subjects: matchRequest.subjects } });
        let hasError = !!resSubs.errors;
        if (resSubs.data && !hasError) {
            if (!isEdit) {
                const resRequest = await createMatchRequest();
                hasError = !!resRequest.errors;
            }
        }
        setIsLoading(false);
        hasError ? toast.error(t('error')) : setShowSuccessModal(true);
    }, [createMatchRequest, matchRequest.subjects, showSuccessModal, toast, update, isEdit]);

    const handleOnOpenChange = (open: boolean) => {
        setShowSuccessModal(open);
        if (!open) {
            navigate('/matching', {
                state: { tabID: 1 },
            });
        }
    };

    return (
        <AsNavigationItem path="matching">
            <WithNavigation
                previousFallbackRoute="/matching"
                isLoading={loading}
                headerLeft={
                    <div className="flex">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </div>
                }
            >
                <RequestMatchContext.Provider
                    value={{
                        isEdit,
                        matchRequest,
                        setSubject,
                        removeSubject,
                        setSkippedSubjectPriority,
                        skippedSubjectPriority,
                        setSkippedSubjectList,
                        skippedSubjectList,
                        setMessage,
                        setSubjectPriority,
                        currentStep,
                        setCurrentStep,
                        requestMatch,
                    }}
                >
                    {!loading && !isLoading && data && (
                        <div className="px-2 pb-2">
                            <Breadcrumb />
                            {currentStep === RequestMatchStep.updateData && (
                                <UpdateData
                                    schooltype={data.me.pupil!.schooltype}
                                    gradeAsInt={data.me.pupil!.gradeAsInt}
                                    state={data.me.pupil!.state}
                                    calendarPreferences={data?.me?.pupil?.calendarPreferences}
                                    languages={(data?.me?.pupil?.languages as unknown as Language[]) ?? []}
                                    refetchQuery={query}
                                />
                            )}
                            {currentStep === RequestMatchStep.german && <German />}
                            {currentStep === RequestMatchStep.subjects && <Subjects />}
                            {currentStep === RequestMatchStep.priority && <Priority />}
                        </div>
                    )}
                    {(loading || isLoading) && <CenterLoadingSpinner />}
                </RequestMatchContext.Provider>
                <InformationModal
                    isOpen={showSuccessModal}
                    onOpenChange={handleOnOpenChange}
                    headline={
                        <span className="flex items-center gap-x-2">
                            {(!isEdit && t('matching.wizard.pupil.modalSuccess.heading.ver1')) || t('matching.wizard.pupil.modalSuccess.heading.ver2')}{' '}
                            <IconCircleCheckFilled className="inline text-green-600" />
                        </span>
                    }
                    showCloseButton={false}
                >
                    <Typography className="text-pretty mb-4">
                        {(!isEdit && t('matching.wizard.pupil.modalSuccess.text.ver1')) || t('matching.wizard.pupil.modalSuccess.text.ver2')}
                    </Typography>
                    <ModalFooter>
                        <Button className="w-full lg:w-fit" variant="outline" onClick={() => handleOnOpenChange(false)}>
                            {t('done')}
                        </Button>
                        <Button
                            onClick={() => {
                                setShowSuccessModal(false);
                                navigate('/group');
                            }}
                            className="w-full lg:w-fit"
                        >
                            {t('matching.wizard.pupil.modalSuccess.groupCourses')}
                        </Button>
                    </ModalFooter>
                </InformationModal>
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default RequestMatch;
