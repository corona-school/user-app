import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import useApollo from './hooks/useApollo'
import Dashboard from './pages/pupil/Dashboard'
import Login from './pages/Login'
import Profile from './pages/pupil/Profile'

import Settings from './pages/Settings'
import OnboardingTourList from './pages/OnboardingTourList'
import Welcome from './pages/Welcome'
import ChangeSettingSubject from './pages/change-setting/ChangeSettingSubject'
import HelpCenter from './pages/Helpcenter'

import ChangeSettingSchoolType from './pages/change-setting/ChangeSettingSchoolType'
import ChangeSettingState from './pages/change-setting/ChangeSettingState'
import ChangeSettingLanguage from './pages/change-setting/ChangeSettingLanguage'
import ChangeSettingSchoolClass from './pages/change-setting/ChangeSettingSchoolClass'
import SingleCourse from './pages/SingleCourse'

import RegistrationAccount from './pages/registration/RegistrationAccount'
import RegistrationPersonal from './pages/registration/RegistrationPersonal'
import AdditionalData from './pages/registration/AdditionalData'
import { RegistrationProvider } from './hooks/useRegistration'

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
import { gql, useQuery } from '@apollo/client'
import DashboardStudent from './pages/student/DashboardStudent'
import Matching from './pages/pupil/Matching'
import RequestMatch from './pages/student/RequestMatch'
import ProfileStudent from './pages/student/ProfileStudent'
import MatchingStudent from './pages/student/MatchingStudent'
import useLernfair from './hooks/useLernfair'
import RequestCertificate from './pages/RequestCertificate'
import PupilGroup from './pages/pupil/Group'
import StudentGroup from './pages/student/StudentGroup'
import StudentGroupSupport from './pages/student/StudentGroupSupport'
import AppointmentsArchive from './pages/AppointmentsArchive'
import CourseArchive from './pages/CourseArchive'
import { useEffect } from 'react'
import LearningPartnerArchive from './pages/LearningPartnerArchive'
import UserProfile from './pages/UserProfile'
import NoAcceptRegistration from './pages/NoAcceptRegistration'
import VerifyEmail from './pages/VerifyEmail'
import VerifyEmailModal from './modals/VerifyEmailModal'
import CenterLoadingSpinner from './components/CenterLoadingSpinner'
import ResetPassword from './pages/ResetPassword'
import LoginToken from './pages/LoginToken'
import IFrame from './components/IFrame'

export default function Navigator() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        <Route path="/login" element={<Login />} />
        <Route path="/login-token" element={<LoginToken />} />
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

        <Route path="/welcome" element={<Welcome />} />

        <Route
          path="/registration-rejected"
          element={<NoAcceptRegistration />}
        />

        {/* Private */}

        <Route
          path="/"
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
          path="/dashboard"
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
        <Route
          path="*"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { userType } = useLernfair()
  const location = useLocation()
  const { sessionState } = useApollo()

  const { data, loading } = useQuery(
    gql`
      query {
        me {
          email
          pupil {
            id
            verifiedAt
          }
          student {
            id
            verifiedAt
          }
        }
      }
    `,
    { skip: !userType }
  )

  if (sessionState === 'logged-out')
    return <Navigate to="/welcome" state={{ from: location }} replace />

  if (sessionState === 'logged-in') {
    if (data && data.me.pupil && !data.me.pupil.verifiedAt)
      return <VerifyEmailModal email={data.me.email} />
    if (data && data.me.student && !data.me.student.verifiedAt)
      return <VerifyEmailModal email={data.me.email} />

    return children
  }

  if (loading) return <CenterLoadingSpinner />

  return <Navigate to="/welcome" state={{ from: location }} replace />
}

const SwitchUserType = ({
  pupilComponent,
  studentComponent
}: {
  pupilComponent?: JSX.Element
  studentComponent?: JSX.Element
}) => {
  const location = useLocation()
  const { userType, setUserType } = useLernfair()

  const { data, error, loading } = useQuery(
    gql`
      query {
        me {
          pupil {
            id
            verifiedAt
          }
          student {
            id
            verifiedAt
          }
        }
      }
    `,
    { skip: !!userType }
  )
  const me = data?.me

  useEffect(() => {
    !loading &&
      !userType &&
      setUserType &&
      setUserType(!!me?.student ? 'student' : 'pupil')
  }, [me?.student, setUserType, userType, loading])

  if (loading || !userType) return <></>

  if (!userType && !me && error)
    return <Navigate to="/welcome" state={{ from: location }} replace />

  if (userType === 'student' || !!me?.student) {
    if (studentComponent) return studentComponent
    else return <Navigate to="/dashboard" state={{ from: location }} replace />
  } else {
    if (pupilComponent) return pupilComponent
    else return <Navigate to="/dashboard" state={{ from: location }} replace />
  }
}
