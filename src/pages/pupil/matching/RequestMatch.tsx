import { useMatomo } from '@jonkoops/matomo-tracker-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AsNavigationItem from '../../../components/AsNavigationItem';
import NotificationAlert from '../../../components/notifications/NotificationAlert';
import WithNavigation from '../../../components/WithNavigation';
import { Subject } from '../../../gql/graphql';
import German from './German';
import Priority from './Priority';
import Subjects from './Subjects';
import UpdateData from './UpdateData';
import SwitchLanguageButton from '../../../components/SwitchLanguageButton';
import { Breadcrumb } from '@/components/Breadcrumb';
import CenterLoadingSpinner from '@/components/CenterLoadingSpinner';
import { BookScreeningAppointment } from './BookScreeningAppointment';
import { MatchRequestSentModal } from './MatchRequestSentModal';
import { useMatchRequestForm } from './useMatchRequestForm';
import { MatchRequestStep } from './util';

export type MatchRequest = {
    subjects: Subject[];
    appointmentStart?: Date;
};

const RequestMatch: React.FC = () => {
    const { form, onFormChange, isLoading } = useMatchRequestForm();
    const location = useLocation();
    const locationState = location.state as { edit: boolean };
    const { trackPageView } = useMatomo();

    useEffect(() => {
        trackPageView({
            documentTitle: 'Schüler Matching',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (locationState?.edit) {
            onFormChange({ currentStep: MatchRequestStep.updateData, isEdit: true });
        }
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
                    <div className="px-2 pb-9 relative h-full">
                        <div className="h-5">
                            <Breadcrumb />
                        </div>
                        <div className="relative h-full">
                            {form.currentStep === MatchRequestStep.updateData && <UpdateData />}
                            {form.currentStep === MatchRequestStep.german && <German />}
                            {form.currentStep === MatchRequestStep.subjects && <Subjects />}
                            {form.currentStep === MatchRequestStep.priority && <Priority />}
                            {form.currentStep === MatchRequestStep.bookScreeningAppointment && <BookScreeningAppointment />}
                        </div>
                    </div>
                )}
                {isLoading && <CenterLoadingSpinner />}
                <MatchRequestSentModal
                    screeningAppointment={form.screeningAppointment ? new Date(form.screeningAppointment.start) : undefined}
                    isOpen={!!form.isCompleted}
                />
            </WithNavigation>
        </AsNavigationItem>
    );
};
export default RequestMatch;
