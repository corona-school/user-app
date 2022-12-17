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
  query StudentMatchRequestCount {
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
  isEdit: boolean
}
export const RequestMatchContext = createContext<RequestMatchContextType>({
  matching: { subjects: [], schoolClasses: {} },
  setMatching: () => null,
  setCurrentIndex: () => null,
  isEdit: false
})

const RequestMatching: React.FC = () => {
  const { space } = useTheme()
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [matching, setMatching] = useState<MatchRequest>({
    subjects: [],
    schoolClasses: {}
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const location = useLocation()
  const locationState = location.state as { edit: boolean }
  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Schüler Matching'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setIsEdit(locationState?.edit)
    setIsLoading(false)
  }, [locationState])

  const { data, loading } = useQuery(query)

  return (
    <AsNavigationItem path="matching">
      <WithNavigation showBack isLoading={loading || isLoading}>
        <RequestMatchContext.Provider
          value={{ matching, setMatching, setCurrentIndex, isEdit }}>
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
