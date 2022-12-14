import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { Text, useTheme, VStack } from 'native-base'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'
import { useLocation } from 'react-router-dom'
import WithNavigation from '../components/WithNavigation'
import { LFMatch } from '../types/lernfair/Match'
import InstructionProgress from '../widgets/InstructionProgress'
import RequestCertificateData from './certificates/RequestCertificateData'
import RequestCertificateMode from './certificates/RequestCertificateMode'
import RequestCertificateOverview from './certificates/RequestCertificateOverview'

type Props = {}

type IRequestCertificateData = {
  subject?: string | boolean
  otherActions: string[]
  pupilMatches: LFMatch[]
  requestData: {}
}
type IRequestCertificateContext = {
  state: IRequestCertificateData
  setState: Dispatch<SetStateAction<IRequestCertificateData>>
}
export const RequestCertificateContext =
  createContext<IRequestCertificateContext>({
    state: { otherActions: [], pupilMatches: [], requestData: {} },
    setState: () => null
  })

const RequestCertificate: React.FC<Props> = () => {
  const { trackPageView } = useMatomo()
  const location = useLocation() as { state: { type: 'group' | 'matching' } }
  const certType = location?.state?.type

  const { space } = useTheme()
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const [state, setState] = useState<IRequestCertificateData>({
    otherActions: [],
    pupilMatches: [],
    requestData: {}
  })

  const onNext = useCallback(() => {
    setCurrentIndex(prev => prev + 1)
  }, [])
  const onBack = useCallback(() => {
    setCurrentIndex(prev => prev - 1)
  }, [])
  const onGeneric = useCallback(() => {}, [])
  const onAutomatic = useCallback(() => {}, [])
  const onManual = useCallback(() => {}, [])

  useEffect(() => {
    trackPageView({
      documentTitle: 'Zertifikate anfordern'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!certType) return <Text>Es ist ein Fehler aufgetreten</Text>

  return (
    <RequestCertificateContext.Provider value={{ state, setState }}>
      <WithNavigation>
        <VStack paddingX={space['1']} space={space['1']}>
          <InstructionProgress
            currentIndex={currentIndex}
            instructions={[
              { label: 'Beantragen', title: '' },
              { label: 'Angaben', title: '' },
              { label: 'Modus', title: '' }
            ]}
          />
          {currentIndex === 0 && (
            <RequestCertificateOverview
              onNext={onNext}
              onBack={onBack}
              onGeneric={onGeneric}
            />
          )}
          {currentIndex === 1 && (
            <RequestCertificateData
              onNext={onNext}
              onBack={onBack}
              certificateType={certType}
            />
          )}
          {currentIndex === 2 && (
            <RequestCertificateMode
              onBack={onBack}
              onAutomatic={onAutomatic}
              onManual={onManual}
            />
          )}
        </VStack>
      </WithNavigation>
    </RequestCertificateContext.Provider>
  )
}
export default RequestCertificate
