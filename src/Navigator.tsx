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
import EditProfile from './pages/EditProfile'
import Login from './pages/Login'
import Profile from './pages/pupil/Profile'

import Settings from './pages/Settings'
import OnboardingTourList from './pages/OnboardingTourList'
import Welcome from './pages/Welcome'
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
import RegistrationData from './pages/registration/RegistrationData'
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
import { gql, useQuery } from '@apollo/client'
import MatchingBlocker from './pages/student/MatchingBlocker'
import CourseBlocker from './pages/student/CourseBlocker'
import DashboardStudent from './pages/student/DashboardStudent'
import ProfileHelper from './pages/student/ProfileStudent'
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

export default function Navigator() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        <Route path="/login" element={<Login />} />
        <Route
          path="/registration"
          element={
            <RegistrationProvider>
              <Outlet />
            </RegistrationProvider>
          }>
          <Route path="1" element={<RegistrationAccount />} />
          <Route path="2" element={<RegistrationPersonal />} />
          <Route path="3" element={<RegistrationData />} />
        </Route>

        <Route path="/welcome" element={<Welcome />} />

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
          path="/explore"
          element={
            <RequireAuth>
              <Explore />
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
          path="/profile-helper"
          element={
            <RequireAuth>
              <ProfileHelper />
            </RequireAuth>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <RequireAuth>
              <EditProfile />
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
          path="/alle-faqs"
          element={
            <RequireAuth>
              <AllFaq />
            </RequireAuth>
          }></Route>

        <Route
          path="/quick-start"
          element={
            <RequireAuth>
              <QuickStart />
            </RequireAuth>
          }></Route>

        <Route
          path="/digitale-tools"
          element={
            <RequireAuth>
              <DigitaleTools />
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
          path="/matching-1-1"
          element={
            <RequireAuth>
              <MatchingBlocker />
            </RequireAuth>
          }
        />

        <Route
          path="/course"
          element={
            <RequireAuth>
              <CourseBlocker />
            </RequireAuth>
          }
        />

        <Route
          path="/request-certificate"
          element={
            // <RequireAuth>
            <RequestCertificate />
            // </RequireAuth>
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
          path="/appointments-archive"
          element={
            <RequireAuth>
              <AppointmentsArchive />
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
  const { token } = useApollo()
  const location = useLocation()

  if (!token)
    return <Navigate to="/welcome" state={{ from: location }} replace />
  return children
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
          }
          student {
            id
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

  if (loading) return <></>

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
