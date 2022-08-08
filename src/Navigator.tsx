import { BrowserRouter, Route, Routes } from 'react-router-dom'
import useApollo from './hooks/useApollo'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import Login from './pages/Login'
import Profile from './pages/Profile'

export default function Navigator() {
  const { token } = useApollo()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
