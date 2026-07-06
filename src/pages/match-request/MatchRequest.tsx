import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AsNavigationItem from '@/components/AsNavigationItem';
import NotificationAlert from '@/components/notifications/NotificationAlert';
import WithNavigation from '@/components/WithNavigation';
import Priority from './Priority';
import PupilSubjects from './PupilSubjects';
import UpdateData from './UpdateData';
import SwitchLanguageButton from '@/components/SwitchLanguageButton';
import { Breadcrumb } from '@/components/Breadcrumb';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { BookScreeningAppointment } from './BookScreeningAppointment';
import { MatchRequestSentModal, StudentMatchRequestSentModal } from './MatchRequestSentModal';
import { useMatchRequestForm } from './useMatchRequestForm';
import { MatchRequestStep } from './util';
import StudentSubjects from './StudentSubjects';
import SubjectsGrade from './SubjectsGrade';

const MatchRequest: React.FC = () => {
    const { form, onFormChange, isLoading } = useMatchRequestForm();
    const location = useLocation();
    const locationState = location.state as { edit: boolean };
    const { trackPageView } = useMatomo();

    useEffect(() => {
        if (form.userType) {
            trackPageView({
                documentTitle: form.userType === 'pupil' ? 'Schüler Matching' : 'Helfer Matching',
            });
        }
    }, [form.userType, trackPageView]);

    useEffect(() => {
        if (locationState?.edit) {
            onFormChange({ currentStep: MatchRequestStep.subjects, isEdit: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationState]);

    return (
        <AsNavigationItem path="matching">
            <WithNavigation
                previousFallbackRoute="/matching"
                headerLeft={
                    <div className="flex">
                        <SwitchLanguageButton />
                        <NotificationAlert />
                    </div>
                }
            >
                {!isLoading && (
                    <div className="pb-9 relative h-full">
                        <div className="h-5">
                            <Breadcrumb />
                        </div>
                        <div className="relative h-full">
                            {form.currentStep === MatchRequestStep.subjects && (form.userType === 'pupil' ? <PupilSubjects /> : <StudentSubjects />)}
                            {form.currentStep === MatchRequestStep.grades && <SubjectsGrade />}
                            {form.currentStep === MatchRequestStep.priority && <Priority />}
                            {form.currentStep === MatchRequestStep.updateData && <UpdateData />}
                            {form.currentStep === MatchRequestStep.bookScreeningAppointment && <BookScreeningAppointment />}
                        </div>
                    </div>
                )}
                {isLoading && <CenterLoadingSpinner />}
                <MatchRequestSentModal
                    screeningAppointment={form.screeningAppointment ? new Date(form.screeningAppointment.start) : undefined}
                    isOpen={!!form.isCompleted && form.userType === 'pupil'}
                />
                <StudentMatchRequestSentModal isOpen={!!form.isCompleted && form.userType === 'student'} />
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default MatchRequest;
