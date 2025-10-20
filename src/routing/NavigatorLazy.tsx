import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/pupil/Dashboard';
import ProfilePupil from '../pages/pupil/ProfilePupil';

import Settings from '../pages/Settings';
import OnboardingTourList from '../pages/OnboardingTourList';
import HelpCenter from '../pages/Helpcenter';
import ChangeSettingSchoolType from '../pages/change-setting/ChangeSettingSchoolType';
import ChangeSettingState from '../pages/change-setting/ChangeSettingState';
import ChangeSettingLanguage from '../pages/change-setting/ChangeSettingLanguage';
import ChangeSettingSchoolClass from '../pages/change-setting/ChangeSettingSchoolClass';

// Onboarding Students
import OnBoardingStudentWelcome from '../pages/onboarding/student/OnBoardingStudentWelcome';
import OnBoardingStudentSlides from '../pages/onboarding/student/OnBoardingStudentSlides';
import OnBoardingStudentFinisher from '../pages/onboarding/student/OnBoardingStudentFinisher';

// Onboarding Helper
import OnBoardingHelperWelcome from '../pages/onboarding/helper/OnBoardingHelperWelcome';
import OnBoardingHelperSlides from '../pages/onboarding/helper/OnBoardingHelperSlides';
import OnBoardingHelperFinisher from '../pages/onboarding/helper/OnBoardingHelperFinisher';

// Onboarding Helper Matching
import OnBoardingHelperMatchingWelcome from '../pages/onboarding/helper-matching/OnBoardingHelperMatchingWelcome';
import OnBoardingHelperMatchingSlides from '../pages/onboarding/helper-matching/OnBoardingHelperMatchingSlides';
import OnBoardingHelperMatchingFinisher from '../pages/onboarding/helper-matching/OnBoardingHelperMatchingFinisher';

// Profile

import CreateCourse from '../pages/CreateCourse';
import DashboardStudent from '../pages/student/DashboardStudent';

import ProfileStudent from '../pages/student/ProfileStudent';
import RequestCertificate from '../pages/RequestCertificate';
import PupilGroup from '../pages/pupil/Group';
import VerifyEmail from '../pages/VerifyEmail';
import VerifyEmailModal from '../modals/VerifyEmailModal';
import ResetPassword from '../pages/ResetPassword';
import { RequireAuth, RequireRole, SwitchUserType } from '../User';
import IFrame from '../components/IFrame';
import WithNavigation from '../components/WithNavigation';
import Registration from '../pages/Registration';

import RequestMatchStudent from '../pages/student/matching/RequestMatch';
import RequestMatch from '../pages/pupil/matching/RequestMatch';
import Matching from '../pages/pupil/Matching';
import NotficationControlPanel from '../pages/notification/NotficationControlPanel';
import Appointments from '../pages/Appointments';
import CreateAppointment from '../pages/CreateAppointment';
import Appointment from '../pages/Appointment';
import EditAppointment from '../pages/EditAppointment';
import SingleCoursePupil from '../pages/pupil/SingleCoursePupil';
import SingleCourseStudent from '../pages/student/SingleCourseStudent';
import LeftVideoChat from '../widgets/LeftVideoChat';
import ChangeEmail from '../pages/ChangeEmail';
import VerifyEmailChange from '../pages/VerifyEmailChange';
import SingleMatch from '../pages/SingleMatch';
import CoursePage from '../pages/CoursePage';
import MatchPage from '../pages/MatchPage';
import Chat from '../pages/Chat';
import { ScreeningDashboard } from '../pages/screening/Dashboard';
import { lazyWithRetry } from '../lazy';
import { Suspense } from 'react';
import CenterLoadingSpinner from '../components/CenterLoadingSpinner';
import { datadogRum } from '@datadog/browser-rum';
import ProgressPage from '../pages/Progress';
import ConfirmCertificate from '../pages/ConfirmCertificate';
import CertificateOfConduct from '../pages/CertificateOfConduct';
import ScreenerGroup from '../pages/screening/ScreenerGroup';
import SingleCourseScreener from '../pages/screening/SingleCourseScreener';
import { SystemNotifications } from '../components/notifications/preferences/SystemNotifications';
import { MarketingNotifications } from '../components/notifications/preferences/MarketingNotifications';
import ForStudents from '../pages/ForStudents';
import ForPupils from '../pages/ForPupils';
import { useBreakpointValue } from 'native-base';
import SessionManager from '../pages/SessionManager';
import useApollo from '@/hooks/useApollo';
import InstallApp from '@/pages/InstallApp';
import Lesson from '@/pages/Lesson';
import EthicsOnboardingSlides from '@/pages/onboarding/ethical-standards/EthicsOnboardingSlides';
import EthicsOnboardingWelcome from '@/pages/onboarding/ethical-standards/EthicsOnboardingWelcome';
import Referrals from '@/pages/Referrals';
import CertificatesPage from '@/pages/student/Certificates';
import { HOMEWORK_HELP_COURSE } from '@/config';
import CalendarPreferencesPage from '@/pages/CalendarPreferencesPage';
import { RegistrationProvider } from '@/pages/registration/useRegistrationForm';
import ForgotPassword from '@/pages/ForgotPassword';

// Zoom loads a lot of large CSS and JS (and adds it inline, which breaks Datadog Session Replay),
// so we try to load that as late as possible (when a meeting is opened)
const ZoomMeeting = lazyWithRetry(
    () => {
        // Disable Datadog Session Replay (for the Meeting window)
        // When leaving the window we reload the page, which reenables session replay (in another session)
        datadogRum.stopSessionReplayRecording();
        // Then load Zoom
        return import('../components/ZoomMeeting');
    },
    { prefetch: false }
);

export default function NavigatorLazy() {
    const isMobileSM = useBreakpointValue({
        base: true,
        sm: false,
    });

    const { sessionState } = useApollo();

    return (
        <Routes>
            {/* Public */}

            <Route
                path="/registration/*"
                element={
                    <RegistrationProvider>
                        <Registration />
                    </RegistrationProvider>
                }
            ></Route>

            {/* Private */}
            <Route
                path="/start"
                element={
                    <RequireAuth>
                        <SwitchUserType pupilComponent={<Dashboard />} studentComponent={<DashboardStudent />} screenerComponent={<ScreeningDashboard />} />
                    </RequireAuth>
                }
            />

            <Route
                path="/single-course/:id"
                element={
                    <RequireAuth>
                        <RequireRole roles={['STUDENT', 'PARTICIPANT', 'COURSE_SCREENER']}>
                            <SwitchUserType
                                pupilComponent={<SingleCoursePupil />}
                                studentComponent={<SingleCourseStudent />}
                                screenerComponent={<SingleCourseScreener />}
                            />
                        </RequireRole>
                    </RequireAuth>
                }
            />

            <Route
                path="/profile"
                element={
                    <RequireAuth>
                        <SwitchUserType pupilComponent={<ProfilePupil />} studentComponent={<ProfileStudent />} />
                    </RequireAuth>
                }
            />
            <Route
                path="/certificates"
                element={
                    <RequireAuth>
                        <CertificatesPage />
                    </RequireAuth>
                }
            />

            <Route
                path="/notifications"
                element={
                    <RequireAuth>
                        <NotficationControlPanel />
                    </RequireAuth>
                }
            >
                <Route path="system" element={<SystemNotifications />} />
                <Route path="newsletter" element={<MarketingNotifications />} />
                <Route index element={<Navigate to="system" />} />
            </Route>

            <Route
                path="/settings"
                element={
                    <RequireAuth>
                        <Settings />
                    </RequireAuth>
                }
            />

            <Route
                path="/change-setting"
                element={
                    <RequireAuth>
                        <Outlet />
                    </RequireAuth>
                }
            >
                <Route path="school-type" element={<ChangeSettingSchoolType />} />
                <Route path="state" element={<ChangeSettingState />} />
                <Route path="language" element={<ChangeSettingLanguage />} />
                <Route path="class" element={<ChangeSettingSchoolClass />} />
            </Route>

            <Route
                path="/hilfebereich"
                element={
                    <RequireAuth>
                        <HelpCenter />
                    </RequireAuth>
                }
            ></Route>

            <Route
                path="/onboarding-list"
                element={
                    <RequireAuth>
                        <OnboardingTourList />
                    </RequireAuth>
                }
            />

            <Route
                path="/request-certificate"
                element={
                    <RequireAuth>
                        <RequestCertificate />
                    </RequireAuth>
                }
            />

            <Route
                path="/certificate-of-conduct"
                element={
                    <RequireAuth>
                        <RequireRole roles={['STUDENT']}>
                            <CertificateOfConduct />
                        </RequireRole>
                    </RequireAuth>
                }
            />

            {/* Onboarding Subpages */}
            <Route
                path="/onboarding"
                element={
                    <RequireAuth>
                        <Outlet />
                    </RequireAuth>
                }
            >
                <Route path="students" element={<OnBoardingStudentWelcome />} />
                <Route path="helper" element={<OnBoardingHelperWelcome />} />
                <Route path="helpermatching" element={<OnBoardingHelperMatchingWelcome />} />
                <Route path="ethics" />
            </Route>

            {/* Ethics Onboarding for HuHs */}
            <Route
                path="/onboarding/ethics"
                element={
                    <RequireAuth>
                        <Outlet />
                    </RequireAuth>
                }
            >
                <Route path="welcome" element={<EthicsOnboardingWelcome />} />
                <Route path="wizard" element={<EthicsOnboardingSlides />} />
                <Route path="*" element={<EthicsOnboardingWelcome />} />
            </Route>

            {/* Onboarding Students */}
            <Route
                path="/onboarding/students"
                element={
                    <RequireAuth>
                        <Outlet />
                    </RequireAuth>
                }
            >
                <Route path="welcome" element={<OnBoardingStudentWelcome />} />
                <Route path="wizard" element={<OnBoardingStudentSlides />} />
                <Route path="finish" element={<OnBoardingStudentFinisher />} />
                <Route path="*" element={<OnBoardingStudentWelcome />} />
            </Route>

            {/* Onboarding Helper */}
            <Route
                path="/onboarding/helper"
                element={
                    <RequireAuth>
                        <Outlet />
                    </RequireAuth>
                }
            >
                <Route path="welcome" element={<OnBoardingHelperWelcome />} />
                <Route path="wizard" element={<OnBoardingHelperSlides />} />
                <Route path="finish" element={<OnBoardingHelperFinisher />} />
                <Route path="*" element={<OnBoardingHelperWelcome />} />
            </Route>

            {/* Onboarding Helper Matching */}

            <Route
                path="/onboarding/helpermatching"
                element={
                    <RequireAuth>
                        <Outlet />
                    </RequireAuth>
                }
            >
                <Route path="welcome" element={<OnBoardingHelperMatchingWelcome />} />
                <Route path="wizard" element={<OnBoardingHelperMatchingSlides />} />
                <Route path="finish" element={<OnBoardingHelperMatchingFinisher />} />
                <Route path="*" element={<OnBoardingHelperMatchingWelcome />} />
            </Route>

            {/* Create Course */}
            <Route
                path="/create-course"
                element={
                    <RequireAuth>
                        <RequireRole roles={['INSTRUCTOR']}>
                            <CreateCourse />
                        </RequireRole>
                    </RequireAuth>
                }
            />

            {/* Edit Course */}
            <Route
                path="/edit-course"
                element={
                    <RequireAuth>
                        <RequireRole roles={['INSTRUCTOR', 'COURSE_SCREENER']}>
                            <CreateCourse />
                        </RequireRole>
                    </RequireAuth>
                }
            />

            {/* Group */}
            <Route
                path="/group"
                element={
                    <RequireAuth>
                        {/* for helpers ('students') we do not require the INSTRUCTOR role, as we have a fallback page in place */}
                        <RequireRole roles={['STUDENT', 'PARTICIPANT', 'COURSE_SCREENER']}>
                            <SwitchUserType pupilComponent={<PupilGroup />} studentComponent={<CoursePage />} screenerComponent={<ScreenerGroup />} />
                        </RequireRole>
                    </RequireAuth>
                }
            ></Route>

            <Route
                path="/appointments"
                element={
                    <RequireAuth>
                        <Appointments />
                    </RequireAuth>
                }
            ></Route>
            <Route
                path="/appointment/:id"
                element={
                    <RequireAuth>
                        <Appointment />
                    </RequireAuth>
                }
            ></Route>

            <Route
                path="/video-chat/:id/:type"
                element={
                    <RequireAuth>
                        <Suspense fallback={<CenterLoadingSpinner />}>
                            <ZoomMeeting />
                        </Suspense>
                    </RequireAuth>
                }
            ></Route>
            <Route
                path="/left-chat/:id/:type"
                element={
                    <RequireAuth>
                        <LeftVideoChat />
                    </RequireAuth>
                }
            />

            <Route
                path="/create-appointment"
                element={
                    <RequireAuth>
                        <SwitchUserType pupilComponent={<Dashboard />} studentComponent={<CreateAppointment />} />
                    </RequireAuth>
                }
            />
            <Route
                path="/edit-appointment/:id"
                element={
                    <RequireAuth>
                        <SwitchUserType pupilComponent={<Dashboard />} studentComponent={<EditAppointment />} />
                    </RequireAuth>
                }
            />

            {/* Referral Center */}
            <Route
                path="/referral"
                element={
                    <RequireAuth>
                        <Referrals />
                    </RequireAuth>
                }
            />

            <Route
                path="/matching"
                element={
                    <RequireAuth>
                        {/* for helpers ('students') we do not require the TUTOR role, as we have a fallback page in place */}
                        <RequireRole roles={['STUDENT', 'TUTEE']}>
                            <SwitchUserType pupilComponent={<Matching />} studentComponent={<MatchPage />} />
                        </RequireRole>
                    </RequireAuth>
                }
            />

            <Route
                path="/match/:id"
                element={
                    <RequireAuth>
                        <RequireRole roles={['TUTOR', 'TUTEE']}>
                            <SingleMatch />
                        </RequireRole>
                    </RequireAuth>
                }
            />
            <Route
                path="/request-match"
                element={
                    <RequireAuth>
                        <RequireRole roles={['TUTOR', 'TUTEE']}>
                            <SwitchUserType pupilComponent={<RequestMatch />} studentComponent={<RequestMatchStudent />} />
                        </RequireRole>
                    </RequireAuth>
                }
            />
            <Route
                path="/confirm-certificate/:id"
                element={
                    <RequireAuth>
                        <RequireRole roles={['PUPIL']}>
                            <ConfirmCertificate />
                        </RequireRole>
                    </RequireAuth>
                }
            />

            {/* Chat feature */}
            <Route
                path="/chat"
                element={
                    <RequireAuth>
                        <Chat />
                    </RequireAuth>
                }
            />

            {/* Lesson Plan Generator */}
            <Route
                path="lesson"
                element={
                    <RequireAuth>
                        <RequireRole roles={['STUDENT']}>
                            <Lesson />
                        </RequireRole>
                    </RequireAuth>
                }
            />

            {/* Knowledge Center */}
            <Route
                path="/knowledge-helper"
                element={
                    <RequireAuth>
                        <ForStudents />
                    </RequireAuth>
                }
            >
                <Route path="handbook" element={<IFrame title="handbook" src="https://www.lern-fair.de/iframe/hilfestellungen" />} />
                <Route path="mentoring" element={<IFrame title="mentoring" src="https://www.lern-fair.de/iframe/mentoring-beratung" />} />
                <Route path="online-training" element={<IFrame title="online-training" src="https://www.lern-fair.de/iframe/fortbildungen" />} />
                <Route index element={<Navigate to="handbook" />} />
            </Route>
            <Route
                path="/knowledge-pupil"
                element={
                    <RequireAuth>
                        <ForPupils />
                    </RequireAuth>
                }
            >
                <Route path="learn-methods" element={<IFrame title="learn-methods" src="https://www.lern-fair.de/iframe/hilfestellungen-sus" />} />
                <Route index element={<Navigate to="learn-methods" />} />
            </Route>
            <Route
                path="/progress"
                element={
                    <RequireAuth>
                        <ProgressPage />
                    </RequireAuth>
                }
            />

            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify-email-change" element={<VerifyEmailChange />} />
            <Route path="/email-not-verified" element={<VerifyEmailModal />} />
            <Route
                path="/new-email"
                element={
                    <RequireAuth>
                        <ChangeEmail />
                    </RequireAuth>
                }
            />
            <Route path="/new-password" element={<ResetPassword layout="new-pw" />} />
            <Route path="/reset-password" element={<ForgotPassword />} />

            <Route path="/install" element={<InstallApp />} />

            <Route
                path="/manage-sessions"
                element={
                    <RequireAuth>
                        <SessionManager />
                    </RequireAuth>
                }
            />
            <Route
                path="/calendar-preferences"
                element={
                    <RequireAuth>
                        <CalendarPreferencesPage />
                    </RequireAuth>
                }
            />
            <Route
                path="/datenschutz"
                element={
                    <WithNavigation showBack hideMenu previousFallbackRoute="/settings" headerTitle="Datenschutz">
                        <IFrame title="datenschutz" src="https://www.lern-fair.de/iframe/datenschutz" />
                    </WithNavigation>
                }
            />
            <Route
                path="/agb-schueler"
                element={
                    <WithNavigation showBack hideMenu previousFallbackRoute="/settings" headerTitle="AGB Schüler">
                        <IFrame title="agb-schueler" src="https://www.lern-fair.de/iframe/agb-schueler" />
                    </WithNavigation>
                }
            />
            <Route
                path="/agb-helfer"
                element={
                    <WithNavigation showBack hideMenu previousFallbackRoute="/settings" headerTitle="AGB Helfer">
                        <IFrame title="agb-helfer" src="https://www.lern-fair.de/iframe/agb-helfer" />
                    </WithNavigation>
                }
            />
            <Route
                path="/selbstverpflichtungserklaerung"
                element={
                    <WithNavigation showBack previousFallbackRoute="/start" headerTitle="Selbstverpflichtungserklärung" hideMenu>
                        <IFrame title="selbstverpflichtungserklärung" src="https://lern-fair.de/iframe/straftaten" />
                    </WithNavigation>
                }
            />
            <Route
                path="/impressum"
                element={
                    <WithNavigation
                        showBack={isMobileSM}
                        hideMenu={isMobileSM || sessionState !== 'logged-in'}
                        previousFallbackRoute="/settings"
                        headerTitle="Impressum"
                    >
                        <IFrame title="impressum" src="https://www.lern-fair.de/iframe/impressum" />
                    </WithNavigation>
                }
            />
            {HOMEWORK_HELP_COURSE && <Route path="/hausaufgabenhilfe" element={<Navigate to={`/single-course/${HOMEWORK_HELP_COURSE}`} />} />}
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/start" />} />
        </Routes>
    );
}
