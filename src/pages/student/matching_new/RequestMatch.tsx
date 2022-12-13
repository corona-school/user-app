import { gql, useQuery } from '@apollo/client'
import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Box, useTheme } from 'native-base'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from 'react'
import { useLocation } from 'react-router-dom'
import AsNavigationItem from '../../../components/AsNavigationItem'
import WithNavigation from '../../../components/WithNavigation'
import German from './German'
import SchoolClasses from './SchoolClasses'
import Subjects from './Subjects'
import UpdateData from './UpdateData'

const query = gql`
  query {
    me {
      student {
        state
        openMatchRequestCount
      }
    }
  }
`

export type MatchRequest = {
  setDazSupport?: boolean
  subjects: { label: string; key: string }[]
  schoolClasses: { [key: string]: [number, number] }
}

type RequestMatchContextType = {
  matching: MatchRequest
  setMatching: Dispatch<SetStateAction<MatchRequest>>
  setCurrentIndex: Dispatch<SetStateAction<number>>
}
export const RequestMatchContext = createContext<RequestMatchContextType>({
  matching: { subjects: [], schoolClasses: {} },
  setMatching: () => null,
  setCurrentIndex: () => null
})

const RequestMatching: React.FC = () => {
  const { space } = useTheme()
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [matching, setMatching] = useState<MatchRequest>({
    subjects: [],
    schoolClasses: {}
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const location = useLocation()
  const { trackPageView } = useMatomo()

  const { skipOnboarding } = (location.state || {}) as {
    skipOnboarding: boolean
  }

  useEffect(() => {
    trackPageView({
      documentTitle: 'Schüler Matching'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (skipOnboarding) {
      setCurrentIndex(1)
    }

    setIsLoading(false)
  }, [skipOnboarding, setCurrentIndex])

  const { data, loading } = useQuery(query)

  return (
    <AsNavigationItem path="matching">
      <WithNavigation showBack isLoading={loading || isLoading}>
        <RequestMatchContext.Provider
          value={{ matching, setMatching, setCurrentIndex }}>
          {!loading && !isLoading && (
            <Box paddingX={space['1']} paddingBottom={space['1']}>
              {currentIndex === 0 && (
                <UpdateData
                  state={data.me.student.state}
                  refetchQuery={query}
                />
              )}
              {currentIndex === 1 && <Subjects />}
              {currentIndex === 2 && <German />}
              {currentIndex === 3 && <SchoolClasses />}
            </Box>
          )}
        </RequestMatchContext.Provider>
      </WithNavigation>
    </AsNavigationItem>
  )
}
export default RequestMatching
