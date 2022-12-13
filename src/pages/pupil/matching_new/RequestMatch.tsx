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
import MatchingOnboarding from '../MatchingOnboarding'
import MatchingPending from '../MatchingPending'
import Details from './Details'
import Filter from './Filter'
import German from './German'
import Priority from './Priority'
import Subjects from './Subjects'
import UpdateData from './UpdateData'

const query = gql`
  query {
    me {
      pupil {
        schooltype
        gradeAsInt
        state
        openMatchRequestCount
      }
    }
  }
`

export type MatchRequest = {
  setDazPriority?: boolean
  subjects: { label: string; key: string }[]
  priority: { label?: string; key?: string }
  message?: string
}

type RequestMatchContextType = {
  matching: MatchRequest
  setMatching: Dispatch<SetStateAction<MatchRequest>>
  setCurrentIndex: Dispatch<SetStateAction<number>>
}
export const RequestMatchContext = createContext<RequestMatchContextType>({
  matching: { subjects: [], priority: {} },
  setMatching: () => null,
  setCurrentIndex: () => null
})

const RequestMatch: React.FC = () => {
  const { space } = useTheme()
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [matching, setMatching] = useState<MatchRequest>({
    subjects: [],
    priority: {},
    message: ''
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
          {!loading &&
            !isLoading &&
            ((data?.me?.pupil.openMatchRequestCount === 0 && (
              <Box paddingX={space['1']} paddingBottom={space['1']}>
                {currentIndex === 0 && <Filter />}
                {currentIndex === 1 && (
                  <UpdateData
                    schooltype={data.me.pupil.schooltype}
                    gradeAsInt={data.me.pupil.gradeAsInt}
                    state={data.me.pupil.state}
                    refetchQuery={query}
                  />
                )}
                {currentIndex === 2 && <German />}
                {currentIndex === 3 && <Subjects />}
                {currentIndex === 4 && <Priority />}
                {currentIndex === 5 && <Details />}
              </Box>
            )) || <MatchingPending refetchQuery={query} />)}
        </RequestMatchContext.Provider>
      </WithNavigation>
    </AsNavigationItem>
  )
}
export default RequestMatch
