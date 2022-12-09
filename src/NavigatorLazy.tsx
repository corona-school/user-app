import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/pupil/Dashboard'
import Profile from './pages/pupil/Profile'

import Settings from './pages/Settings'
import OnboardingTourList from './pages/OnboardingTourList'
import ChangeSettingSubject from './pages/change-setting/ChangeSettingSubject'
import HelpCenter from './pages/Helpcenter'
import ChangeSettingSchoolType from './pages/change-setting/ChangeSettingSchoolType'
import ChangeSettingState from './pages/change-setting/ChangeSettingState'
import ChangeSettingLanguage from './pages/change-setting/ChangeSettingLanguage'
import ChangeSettingSchoolClass from './pages/change-setting/ChangeSettingSchoolClass'
import SingleCourse from './pages/SingleCourse'

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
import DashboardStudent from './pages/student/DashboardStudent'

import RequestMatch from './pages/student/RequestMatch'
import ProfileStudent from './pages/student/ProfileStudent'
import MatchingStudent from './pages/student/MatchingStudent'
import RequestCertificate from './pages/RequestCertificate'
import PupilGroup from './pages/pupil/Group'
import StudentGroup from './pages/student/StudentGroup'
import StudentGroupSupport from './pages/student/StudentGroupSupport'
import CourseArchive from './pages/CourseArchive'
import LearningPartnerArchive from './pages/LearningPartnerArchive'
import UserProfile from './pages/UserProfile'
import NoAcceptRegistration from './pages/NoAcceptRegistration'
import VerifyEmail from './pages/VerifyEmail'
import VerifyEmailModal from './modals/VerifyEmailModal'
import ResetPassword from './pages/ResetPassword'
import { RequireAuth, SwitchUserType } from './User'
import IFrame from './components/IFrame'
import WithNavigation from './components/WithNavigation'
import Registration from './pages/Registration'
import Matching from './pages/pupil/matching_new/Matching'

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
      <Route path="/email-not-verified" element={<VerifyEmailModal />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/datenschutz"
        element={
          <WithNavigation showBack headerTitle="Datenschutz" hideMenu>
            <IFrame
              title="datenschutz"
              src="https://www.lern-fair.de/iframe/datenschutz"
            />
          </WithNavigation>
        }
      />
      <Route
        path="/selbstverpflichtungserklaerung"
        element={
          <WithNavigation
            showBack
            headerTitle="Selbstverpflichtungserklärung"
            hideMenu>
            <IFrame
              title="selbstverpflichtungserklärung"
              src="https://lern-fair.de/iframe/straftaten"
            />
          </WithNavigation>
        }
      />
      <Route
        path="/impressum"
        element={
          <WithNavigation showBack headerTitle="Impressum" hideMenu>
            <IFrame
              title="impressum"
              src="https://www.lern-fair.de/iframe/impressum"
            />
          </WithNavigation>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/start" />} />
    </Routes>
  )
}
