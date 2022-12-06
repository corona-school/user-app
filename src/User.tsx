import { useLocation, Navigate } from "react-router-dom"
import CenterLoadingSpinner from "./components/CenterLoadingSpinner"
import useApollo from "./hooks/useApollo"
import VerifyEmailModal from "./modals/VerifyEmailModal"

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const location = useLocation()
    
    const { sessionState, user } = useApollo()
  
    if (sessionState === 'logged-out')
      return <Navigate to="/welcome" state={{ from: location }} replace />
  
    
    if (sessionState === "unknown" || !user)
      return <CenterLoadingSpinner />

    if (sessionState === 'logged-in') {
      if (user && !(user.pupil ?? user.student).verifiedAt)
        return <VerifyEmailModal email={user.email} />
  
      return children
    }
  
    return <Navigate to="/welcome" state={{ from: location }} replace />
  }
  
  export const SwitchUserType = ({
    pupilComponent,
    studentComponent
  }: {
    pupilComponent?: JSX.Element
    studentComponent?: JSX.Element
  }) => {
    const location = useLocation()
    const { sessionState, user } = useApollo()
  
    if (sessionState === "logged-out")
      return <Navigate to="/welcome" state={{ from: location }} replace />
  
    if (sessionState === "unknown" || !user) 
      return <CenterLoadingSpinner />
  

    if (user!.student) {
      if (studentComponent) return studentComponent
      else return <Navigate to="/dashboard" state={{ from: location }} replace />
    } else {
      if (pupilComponent) return pupilComponent
      else return <Navigate to="/dashboard" state={{ from: location }} replace />
    }
  }
  