import { View, VStack } from 'native-base'
import { ReactNode } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import BottomNavigationBar from './components/BottomNavigationBar'
import useApollo from './hooks/useApollo'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import Login from './pages/Login'
import Playground from './pages/Playground'
import Profile from './pages/Profile'
import Registration from './pages/Registration'

export default function Navigator() {
  return (
    <BrowserRouter>
      <View h="100vh">
        <View flex="1" overflowY="scroll">
          <Routes>
            {/* Public */}

            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />

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
        </View>
        <BottomNavigationBar />
      </View>
    </BrowserRouter>
  )
}

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { token } = useApollo()
  const location = useLocation()

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}
