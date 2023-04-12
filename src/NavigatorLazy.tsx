import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/pupil/Dashboard';
import ProfilePupil from './pages/pupil/ProfilePupil';

import Settings from './pages/Settings';
import OnboardingTourList from './pages/OnboardingTourList';
import HelpCenter from './pages/Helpcenter';
import ChangeSettingSchoolType from './pages/change-setting/ChangeSettingSchoolType';
import ChangeSettingState from './pages/change-setting/ChangeSettingState';
import ChangeSettingLanguage from './pages/change-setting/ChangeSettingLanguage';
import ChangeSettingSchoolClass from './pages/change-setting/ChangeSettingSchoolClass';

// Onboarding Students
import OnBoardingStudentWelcome from './pages/onboarding/student/OnBoardingStudentWelcome';
import OnBoardingStudentSlides from './pages/onboarding/student/OnBoardingStudentSlides';
import OnBoardingStudentFinisher from './pages/onboarding/student/OnBoardingStudentFinisher';

// Onboarding Helper
import OnBoardingHelperWelcome from './pages/onboarding/helper/OnBoardingHelperWelcome';
import OnBoardingHelperSlides from './pages/onboarding/helper/OnBoardingHelperSlides';
import OnBoardingHelperFinisher from './pages/onboarding/helper/OnBoardingHelperFinisher';

// Onboarding Helper Matching
import OnBoardingHelperMatchingWelcome from './pages/onboarding/helper-matching/OnBoardingHelperMatchingWelcome';
import OnBoardingHelperMatchingSlides from './pages/onboarding/helper-matching/OnBoardingHelperMatchingSlides';
import OnBoardingHelperMatchingFinisher from './pages/onboarding/helper-matching/OnBoardingHelperMatchingFinisher';

// Profile

import CreateCourse from './pages/CreateCourse';
import DashboardStudent from './pages/student/DashboardStudent';

import ProfileStudent from './pages/student/ProfileStudent';
import RequestCertificate from './pages/RequestCertificate';
import PupilGroup from './pages/pupil/Group';
import NoAcceptRegistration from './pages/NoAcceptRegistration';
import VerifyEmail from './pages/VerifyEmail';
import VerifyEmailModal from './modals/VerifyEmailModal';
import ResetPassword from './pages/ResetPassword';
import { RequireAuth, SwitchUserType } from './User';
import IFrame from './components/IFrame';
import WithNavigation from './components/WithNavigation';
import Registration from './pages/Registration';

import RequestMatchStudent from './pages/student/matching_new/RequestMatch';
import RequestMatch from './pages/pupil/matching_new/RequestMatch';
import Matching from './pages/pupil/Matching';
import CertificateList from './pages/student/CertificateDetails';
import NotficationControlPanel from './pages/notification/NotficationControlPanel';
import Appointments from './pages/Appointments';
import SingleCoursePupil from './pages/pupil/SingleCoursePupil';
import SingleCourseStudent from './pages/student/SingleCourseStudent';
import ChangeEmail from './pages/ChangeEmail';
import VerifyEmailChange from './pages/VerifyEmailChange';
import SingleMatch from './pages/SingleMatch';
import CoursePage from './pages/CoursePage';
import MatchPage from './pages/MatchPage';
import VideoChat from './pages/VideoChat';

export default function NavigatorLazy() {
    return (
        <Routes>
            {/* Public */}

            <Route path="/registration/" element={<Registration />} />
            <Route path="/registration" element={<Outlet />}>
                <Route path="*" element={<Registration />} />
            </Route>

            <Route path="/registration-rejected" element={<NoAcceptRegistration />} />

            {/* Private */}
            <Route
                path="/start"
                element={
                    <RequireAuth>
                        <SwitchUserType pupilComponent={<Dashboard />} studentComponent={<DashboardStudent />} />
                    </RequireAuth>
                }
            />

            <Route
                path="/single-course/:id"
                element={
                    <RequireAuth isRetainPath>
                        <SwitchUserType pupilComponent={<SingleCoursePupil />} studentComponent={<SingleCourseStudent />} />
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
                path="/notifications"
                element={
                    <RequireAuth isRetainPath>
                        <NotficationControlPanel />
                    </RequireAuth>
                }
            />

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
                path="/certificate-list"
                element={
                    <RequireAuth>
                        <CertificateList />
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
                        <CreateCourse />
                    </RequireAuth>
                }
            />

            {/* Edit Course */}
            <Route
                path="/edit-course"
                element={
                    <RequireAuth>
                        <CreateCourse />
                    </RequireAuth>
                }
            />

            {/* Group */}
            <Route
                path="/group"
                element={
                    <RequireAuth>
                        <SwitchUserType pupilComponent={<PupilGroup />} studentComponent={<CoursePage />} />
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
            />

            <Route
                path="/video-chat"
                element={
                    <RequireAuth>
                        <VideoChat />
                    </RequireAuth>
                }
            />

            <Route
                path="/matching"
                element={
                    <RequireAuth>
                        <SwitchUserType pupilComponent={<Matching />} studentComponent={<MatchPage />} />
                    </RequireAuth>
                }
            />

            <Route
                path="/match/:id"
                element={
                    <RequireAuth>
                        <SingleMatch />
                    </RequireAuth>
                }
            />
            <Route
                path="/request-match"
                element={
                    <RequireAuth>
                        <SwitchUserType pupilComponent={<RequestMatch />} studentComponent={<RequestMatchStudent />} />
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
            <Route
                path="/new-password"
                element={
                    <WithNavigation showBack hideMenu>
                        <ResetPassword layout="new-pw" />
                    </WithNavigation>
                }
            />
            <Route path="/reset-password" element={<ResetPassword layout="reset-pw" />} />

            <Route
                path="/datenschutz"
                element={
                    <WithNavigation showBack headerTitle="Datenschutz" hideMenu>
                        <IFrame title="datenschutz" src="https://www.lern-fair.de/iframe/datenschutz" />
                    </WithNavigation>
                }
            />
            <Route
                path="/selbstverpflichtungserklaerung"
                element={
                    <WithNavigation showBack headerTitle="Selbstverpflichtungserklärung" hideMenu>
                        <IFrame title="selbstverpflichtungserklärung" src="https://lern-fair.de/iframe/straftaten" />
                    </WithNavigation>
                }
            />
            <Route
                path="/impressum"
                element={
                    <WithNavigation showBack headerTitle="Impressum" hideMenu>
                        <IFrame title="impressum" src="https://www.lern-fair.de/iframe/impressum" />
                    </WithNavigation>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/start" />} />
        </Routes>
    );
}
