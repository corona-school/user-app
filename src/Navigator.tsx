import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import useApollo from './hooks/useApollo'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import Login from './pages/Login'
import Profile from './pages/Profile'

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

import OnBoardingStudentWelcome from './pages/onboarding/student/OnBoardingStudentWelcome'
import OnBoardingStudentMatching from './pages/onboarding/student/OnBoardingStudentMatching'
import OnBoardingStudentCourse from './pages/onboarding/student/OnBoardingStudentCourse'
import OnBoardingStudentHelpCenter from './pages/onboarding/student/OnBoardingStudentHelpCenter'
import OnBoardingStudentProfile from './pages/onboarding/student/OnBoardingStudentProfile'
import OnBoardingStudentFinisher from './pages/onboarding/student/OnBoardingStudentFinisher'
import OnBoardingStudentAppointments from './pages/onboarding/student/OnBoardingStudentAppointments'
import OnBoardingHelperWelcome from './pages/onboarding/helper/OnBoardingHelperWelcome'
import OnBoardingHelperMatch from './pages/onboarding/helper/OnBoardingHelperMatch'
import OnBoardingHelperGroup from './pages/onboarding/helper/OnBoardingHelperGroup'
import OnBoardingHelperHelpCenter from './pages/onboarding/helper/OnBoardingHelperHelpCenter'
import OnBoardingHelperProfile from './pages/onboarding/helper/OnBoardingHelperProfile'
import OnBoardingHelperSettings from './pages/onboarding/helper/OnBoardingHelperSettings'
import OnBoardingHelperFinisher from './pages/onboarding/helper/OnBoardingHelperFinisher'
import OnBoardingHelperNotification from './pages/onboarding/helper/OnBoardingHelperNotification'
import OnBoardingHelperMatchingWelcome from './pages/onboarding/helper-matching/OnBoardingHelperMatchingWelcome'
import OnBoardingHelperMatchingRequestMatch from './pages/onboarding/helper-matching/OnBoardingHelperMatchingRequestMatch'
import OnBoardingHelperMatchingRequest from './pages/onboarding/helper-matching/OnBoardingHelperMatchingRequest'
import OnBoardingHelperMatchingMatch from './pages/onboarding/helper-matching/OnBoardingHelperMatchingMatch'
import OnBoardingHelperMatchingContact from './pages/onboarding/helper-matching/OnBoardingHelperMatchingContact'
import OnBoardingHelperMatchingSolveMatching from './pages/onboarding/helper-matching/OnBoardingHelperMatchingSolveMatching'
import OnBoardingHelperMatchingFinisher from './pages/onboarding/helper-matching/OnBoardingHelperMatchingFinisher'
import ProfileHelper from './pages/student/ProfileStudent'
import OnBoardingHelperAppointment from './pages/onboarding/helper/OnBoardingHelperAppointments'
import DashboardHelper from './pages/student/DashboardStudent'
import CreateCourse from './pages/CreateCourse'
import { gql, useQuery } from '@apollo/client'
import MatchingBlocker from './pages/student/MatchingBlocker'
import CourseBlocker from './pages/student/CourseBlocker'

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
                studentComponent={<DashboardHelper />}
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
              <Profile />
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
            // <RequireAuth>
            <OnboardingTourList />
            // </RequireAuth>
          }
        />

        <Route
          path="/matching-1-1"
          element={
            // <RequireAuth>
            <MatchingBlocker />
            // </RequireAuth>
          }
        />

        <Route
          path="/course"
          element={
            // <RequireAuth>
            <CourseBlocker />
            // </RequireAuth>
          }
        />

        <Route
          path="/onboarding"
          element={
            <RequireAuth>
              <Outlet />
            </RequireAuth>
          }>
          <Route
            path="students-welcome"
            element={<OnBoardingStudentWelcome />}
          />
          <Route
            path="students-matching"
            element={<OnBoardingStudentMatching />}
          />
        </Route>
        {/* Onboarding Students */}
        <Route
          path="/onboarding-students"
          element={
            // <RequireAuth>
            <OnBoardingStudentWelcome />
            // </RequireAuth>
          }></Route>
        <Route
          path="/onboarding-students/welcome"
          element={<OnBoardingStudentWelcome />}
        />
        <Route
          path="/onboarding-students/matching"
          element={<OnBoardingStudentMatching />}
        />
        <Route
          path="/onboarding-students/groups"
          element={<OnBoardingStudentCourse />}
        />
        <Route
          path="/onboarding-students/appointments"
          element={<OnBoardingStudentAppointments />}
        />
        <Route
          path="/onboarding-students/helpcenter"
          element={<OnBoardingStudentHelpCenter />}
        />
        <Route
          path="/onboarding-students/profil"
          element={<OnBoardingStudentProfile />}
        />
        <Route
          path="/onboarding-students/finish"
          element={<OnBoardingStudentFinisher />}
        />

        {/* Onboarding Helper */}
        <Route
          path="/onboarding-helper"
          element={
            // <RequireAuth>
            <OnBoardingHelperWelcome />
            // </RequireAuth>
          }></Route>
        <Route
          path="/onboarding-helper/welcome"
          element={<OnBoardingHelperWelcome />}
        />
        <Route
          path="/onboarding-helper/matching"
          element={<OnBoardingHelperMatch />}
        />
        <Route
          path="/onboarding-helper/groups"
          element={<OnBoardingHelperGroup />}
        />
        <Route
          path="/onboarding-helper/appointment"
          element={<OnBoardingHelperAppointment />}
        />
        <Route
          path="/onboarding-helper/helpcenter"
          element={<OnBoardingHelperHelpCenter />}
        />
        <Route
          path="/onboarding-helper/profil"
          element={<OnBoardingHelperProfile />}
        />
        <Route
          path="/onboarding-helper/settings"
          element={<OnBoardingHelperSettings />}
        />
        <Route
          path="/onboarding-helper/notification"
          element={<OnBoardingHelperNotification />}
        />
        <Route
          path="/onboarding-helper/finish"
          element={<OnBoardingHelperFinisher />}
        />

        {/* Onboarding Helper Matching */}
        <Route
          path="/onboarding-helper-matching"
          element={
            // <RequireAuth>
            <OnBoardingHelperMatchingWelcome />
            // </RequireAuth>
          }></Route>
        <Route
          path="/onboarding-helper-matching/welcome"
          element={<OnBoardingHelperMatchingWelcome />}
        />
        <Route
          path="/onboarding-helper-matching/request-matching"
          element={<OnBoardingHelperMatchingRequestMatch />}
        />
        <Route
          path="/onboarding-helper-matching/request"
          element={<OnBoardingHelperMatchingRequest />}
        />
        <Route
          path="/onboarding-helper-matching/match"
          element={<OnBoardingHelperMatchingMatch />}
        />
        <Route
          path="/onboarding-helper-matching/contact"
          element={<OnBoardingHelperMatchingContact />}
        />
        <Route
          path="/onboarding-helper-matching/solve-matching"
          element={<OnBoardingHelperMatchingSolveMatching />}
        />
        <Route
          path="/onboarding-helper-matching/finish"
          element={<OnBoardingHelperMatchingFinisher />}
        />

        <Route path="/create-course" element={<CreateCourse />} />

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
  pupilComponent: JSX.Element
  studentComponent: JSX.Element
}) => {
  const location = useLocation()

  const { data, error, loading } = useQuery(gql`
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
  `)
  const me = data?.me

  if (loading) return <></>
  if (!me || error)
    return <Navigate to="/welcome" state={{ from: location }} replace />

  if (!!me.student) {
    return studentComponent
  } else {
    return pupilComponent
  }
}
