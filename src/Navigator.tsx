import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import useApollo from './hooks/useApollo'
import { gql, useQuery } from '@apollo/client'
import { RegistrationProvider } from './hooks/useRegistration'
import useLernfair from './hooks/useLernfair'
import { useEffect, lazy, Suspense } from 'react'

import VerifyEmailModal from './modals/VerifyEmailModal'
import CenterLoadingSpinner from './components/CenterLoadingSpinner'

const Dashboard = lazy(() => import('./pages/pupil/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import( './pages/pupil/Profile'));

const Settings = lazy(() => import( './pages/Settings'));
const OnboardingTourList = lazy(() => import( './pages/OnboardingTourList'));
const Welcome = lazy(() => import( './pages/Welcome'));
const ChangeSettingSubject = lazy(() => import( './pages/change-setting/ChangeSettingSubject'));
const HelpCenter = lazy(() => import( './pages/Helpcenter'));
const AllFaq = lazy(() => import( './pages/AllFaq'));
const QuickStart = lazy(() => import( './pages/QuickStart'));
const DigitaleTools = lazy(() => import( './pages/DigitaleTools'));
const ChangeSettingSchoolType = lazy(() => import( './pages/change-setting/ChangeSettingSchoolType'));
const ChangeSettingState = lazy(() => import( './pages/change-setting/ChangeSettingState'));
const ChangeSettingLanguage = lazy(() => import( './pages/change-setting/ChangeSettingLanguage'));
const ChangeSettingSchoolClass = lazy(() => import( './pages/change-setting/ChangeSettingSchoolClass'));
const SingleCourse = lazy(() => import( './pages/SingleCourse'));

const RegistrationAccount = lazy(() => import( './pages/registration/RegistrationAccount'));
const RegistrationPersonal = lazy(() => import( './pages/registration/RegistrationPersonal'));
const AdditionalData = lazy(() => import( './pages/registration/AdditionalData'));
const Explore = lazy(() => import( './pages/Explore'));

// Onboarding Students
const OnBoardingStudentWelcome = lazy(() => import( './pages/onboarding/student/OnBoardingStudentWelcome'));
const OnBoardingStudentSlides = lazy(() => import( './pages/onboarding/student/OnBoardingStudentSlides'));
const OnBoardingStudentFinisher = lazy(() => import( './pages/onboarding/student/OnBoardingStudentFinisher'));

// Onboarding Helper
const OnBoardingHelperWelcome = lazy(() => import( './pages/onboarding/helper/OnBoardingHelperWelcome'));
const OnBoardingHelperSlides = lazy(() => import( './pages/onboarding/helper/OnBoardingHelperSlides'));
const OnBoardingHelperFinisher = lazy(() => import( './pages/onboarding/helper/OnBoardingHelperFinisher'));

// Onboarding Helper Matching
const OnBoardingHelperMatchingWelcome = lazy(() => import( './pages/onboarding/helper-matching/OnBoardingHelperMatchingWelcome'));
const OnBoardingHelperMatchingSlides = lazy(() => import( './pages/onboarding/helper-matching/OnBoardingHelperMatchingSlides'));
const OnBoardingHelperMatchingFinisher = lazy(() => import( './pages/onboarding/helper-matching/OnBoardingHelperMatchingFinisher'));

// Profile

const CreateCourse = lazy(() => import( './pages/CreateCourse'));
const MatchingBlocker = lazy(() => import( './pages/student/MatchingBlocker'));
const CourseBlocker = lazy(() => import( './pages/student/CourseBlocker'));
const DashboardStudent = lazy(() => import( './pages/student/DashboardStudent'));
const ProfileHelper = lazy(() => import( './pages/student/ProfileStudent'));
const Matching = lazy(() => import( './pages/pupil/Matching'));
const RequestMatch = lazy(() => import( './pages/student/RequestMatch'));
const ProfileStudent = lazy(() => import( './pages/student/ProfileStudent'));
const MatchingStudent = lazy(() => import( './pages/student/MatchingStudent'));
const RequestCertificate = lazy(() => import( './pages/RequestCertificate'));
const PupilGroup = lazy(() => import( './pages/pupil/Group'));
const StudentGroup = lazy(() => import( './pages/student/StudentGroup'));
const StudentGroupSupport = lazy(() => import( './pages/student/StudentGroupSupport'));
const AppointmentsArchive = lazy(() => import( './pages/AppointmentsArchive'));
const CourseArchive = lazy(() => import( './pages/CourseArchive'));
const LearningPartnerArchive = lazy(() => import( './pages/LearningPartnerArchive'));
const UserProfile = lazy(() => import( './pages/UserProfile'));
const NoAcceptRegistration = lazy(() => import( './pages/NoAcceptRegistration'));
const VerifyEmail = lazy(() => import( './pages/VerifyEmail'));
const ResetPassword = lazy(() => import( './pages/ResetPassword'));
const LoginToken = lazy(() => import( './pages/LoginToken'));

export default function Navigator() {
  return (
    <Suspense fallback={<CenterLoadingSpinner />}>
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
    </Suspense>
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
