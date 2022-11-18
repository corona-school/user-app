import { useQuery, gql } from "@apollo/client"
import { useEffect } from "react"
import { useLocation, Navigate } from "react-router-dom"
import CenterLoadingSpinner from "./components/CenterLoadingSpinner"
import useApollo from "./hooks/useApollo"
import useLernfair from "./hooks/useLernfair"
import VerifyEmailModal from "./modals/VerifyEmailModal"

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
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
  
  export const SwitchUserType = ({
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
  