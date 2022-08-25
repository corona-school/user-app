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
import Playground from './pages/Playground'
import Profile from './pages/Profile'
import Registration from './pages/Registration'
import Settings from './pages/Settings'
import OnboardingTourList from './pages/OnboardingTourList'
import Welcome from './pages/Welcome'
import ChangeSettingSubject from './pages/ChangeSettingSubject'
import HelpCenter from './pages/Helpcenter'
import AllFaq from './pages/AllFaq'
import QuickStart from './pages/QuickStart'
import DigitaleTools from './pages/DigitaleTools'

export default function Navigator() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        <Route path="/welcome" element={<Welcome />} />

        {/* Private */}

        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
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
          path="/playground"
          element={
            <RequireAuth>
              <Playground />
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
