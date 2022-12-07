import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes
} from 'react-router-dom'
import Dashboard from './pages/pupil/Dashboard'
import Profile from './pages/pupil/Profile'

import Settings from './pages/Settings'
import OnboardingTourList from './pages/OnboardingTourList'
import ChangeSettingSubject from './pages/change-setting/ChangeSettingSubject'
import HelpCenter from './pages/Helpcenter'
import AllFaq from './pages/AllFaq'
import QuickStart from './pages/QuickStart'
import DigitaleTools from './pages/DigitaleTools'
import ChangeSettingSchoolType from './pages/change-setting/ChangeSettingSchoolType'
import ChangeSettingState from './pages/change-setting/ChangeSettingState'
import ChangeSettingLanguage from './pages/change-setting/ChangeSettingLanguage'
import ChangeSettingSchoolClass from './pages/change-setting/ChangeSettingSchoolClass'
import SingleCourse from './pages/SingleCourse'

import RegistrationAccount from './pages/registration/RegistrationAccount'
import RegistrationPersonal from './pages/registration/RegistrationPersonal'
import AdditionalData from './pages/registration/AdditionalData'
import { RegistrationProvider } from './hooks/useRegistration'
import Explore from './pages/Explore'

// Onboarding Students
import OnBoardingStudentWelcome from './pages/onboarding/student/OnBoardingStudentWelcome'
import OnBoardingStudentSlides from './pages/onboarding/student/OnBoardingStudentSlides'
import OnBoardingStudentFinisher from './pages/onboarding/student/OnBoardingStudentFinisher'

// Onboarding Helper
import OnBoardingHelperWelcome from './pages/onboarding/helper/OnBoardingHelperWelcome'
import OnBoardingHelperSlides from './pages/onboarding/helper/OnBoardingHelperSlides'
import OnBoardingHelperFinisher from './pages/onboarding/helper/OnBoardingHelperFinisher'

// Onboarding Helper Matching
import OnBoardingHelperMatchingWelcome from './pages/onboarding/helper-matching/OnBoardingHelperMatchingWelcome'
import OnBoardingHelperMatchingSlides from './pages/onboarding/helper-matching/OnBoardingHelperMatchingSlides'
import OnBoardingHelperMatchingFinisher from './pages/onboarding/helper-matching/OnBoardingHelperMatchingFinisher'

// Profile

import CreateCourse from './pages/CreateCourse'
import MatchingBlocker from './pages/student/MatchingBlocker'
import CourseBlocker from './pages/student/CourseBlocker'
import DashboardStudent from './pages/student/DashboardStudent'
import ProfileHelper from './pages/student/ProfileStudent'
import Matching from './pages/pupil/Matching'
import RequestMatch from './pages/student/RequestMatch'
import ProfileStudent from './pages/student/ProfileStudent'
import MatchingStudent from './pages/student/MatchingStudent'
import RequestCertificate from './pages/RequestCertificate'
import PupilGroup from './pages/pupil/Group'
import StudentGroup from './pages/student/StudentGroup'
import StudentGroupSupport from './pages/student/StudentGroupSupport'
import AppointmentsArchive from './pages/AppointmentsArchive'
import CourseArchive from './pages/CourseArchive'
import LearningPartnerArchive from './pages/LearningPartnerArchive'
import UserProfile from './pages/UserProfile'
import NoAcceptRegistration from './pages/NoAcceptRegistration'
import VerifyEmail from './pages/VerifyEmail'
import VerifyEmailModal from './modals/VerifyEmailModal'
import CenterLoadingSpinner from './components/CenterLoadingSpinner'
import ResetPassword from './pages/ResetPassword'
import { RequireAuth, SwitchUserType } from './User'
import IFrame from './components/IFrame'
import NewRegistration from './pages/NewRegistration'

export default function NavigatorLazy() {
  return (
    <Routes>
      {/* Public */}

      <Route path="/new-registration" element={<NewRegistration />} />
      <Route
        path="/registration"
        element={
          <RegistrationProvider>
            <Outlet />
          </RegistrationProvider>
        }>
        <Route path="1" element={<RegistrationAccount />} />
        <Route path="2" element={<RegistrationPersonal />} />
        <Route path="3" element={<AdditionalData />} />
      </Route>

      <Route path="/registration-rejected" element={<NoAcceptRegistration />} />

      {/* Private */}
      <Route
        path="/start"
        element={
          <RequireAuth>
            <SwitchUserType
              pupilComponent={<Dashboard />}
              studentComponent={<DashboardStudent />}
            />
          </RequireAuth>
        }
      />

      <Route
        path="/single-course"
        element={
          <RequireAuth>
            <SingleCourse />
          </RequireAuth>
        }
      />

      <Route
        path="/profile"
        element={
          <RequireAuth>
            <SwitchUserType
              pupilComponent={<Profile />}
              studentComponent={<ProfileStudent />}
            />
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
        }>
        <Route path="subjects" element={<ChangeSettingSubject />} />
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
        }></Route>

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

      {/* Onboarding Subpages */}
      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <Outlet />
          </RequireAuth>
        }>
        <Route path="students" element={<OnBoardingStudentWelcome />} />
        <Route path="helper" element={<OnBoardingHelperWelcome />} />
        <Route
          path="helpermatching"
          element={<OnBoardingHelperMatchingWelcome />}
        />
      </Route>

      {/* Onboarding Students */}
      <Route
        path="/onboarding/students"
        element={
          <RequireAuth>
            <Outlet />
          </RequireAuth>
        }>
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
        }>
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
        }>
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
            <SwitchUserType
              pupilComponent={<PupilGroup />}
              studentComponent={<StudentGroup />}
            />
          </RequireAuth>
        }></Route>

      <Route
        path="/group/offer"
        element={
          <RequireAuth>
            <SwitchUserType
              pupilComponent={<PupilGroup />}
              studentComponent={<StudentGroupSupport />}
            />
          </RequireAuth>
        }></Route>

      <Route
        path="/matching"
        element={
          <RequireAuth>
            <SwitchUserType
              pupilComponent={<Matching />}
              studentComponent={<MatchingStudent />}
            />
          </RequireAuth>
        }
      />
      <Route
        path="/request-match"
        element={
          <RequireAuth>
            <SwitchUserType studentComponent={<RequestMatch />} />
          </RequireAuth>
        }
      />

      <Route
        path="/course-archive"
        element={
          <RequireAuth>
            <CourseArchive />
          </RequireAuth>
        }
      />

      <Route
        path="/learningpartner-archive"
        element={
          <RequireAuth>
            <LearningPartnerArchive />
          </RequireAuth>
        }
      />

      <Route
        path="/user-profile"
        element={
          <RequireAuth>
            <UserProfile />
          </RequireAuth>
        }
      />

      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/additional-data" element={<AdditionalData />} />
      <Route path="/email-not-verified" element={<VerifyEmailModal />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/privacy"
        element={
          <IFrame
            title="datenschutz"
            src="https://www.lern-fair.de/iframe/datenschutz"
          />
        }
      />
      <Route
        path="/imprint"
        element={
          <IFrame
            title="impressum"
            src="https://www.lern-fair.de/iframe/impressum"
          />
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/start" />} />
    </Routes>
  )
}
