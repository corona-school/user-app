import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { useTheme, VStack } from 'native-base'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'
import WithNavigation from '../components/WithNavigation'
import InstructionProgress from '../widgets/InstructionProgress'
import RequestCertificateData from './certificates/RequestCertificateData'
import RequestCertificateMode from './certificates/RequestCertificateMode'
import RequestCertificateOverview from './certificates/RequestCertificateOverview'

type Props = {}

type IRequestCertificateData = {
  subject?: string | boolean
  otherActions: string[]
}
type IRequestCertificateContext = {
  state: IRequestCertificateData
  setState: Dispatch<SetStateAction<IRequestCertificateData>>
}
export const RequestCertificateContext =
  createContext<IRequestCertificateContext>({
    state: { otherActions: [] },
    setState: () => null
  })

const RequestCertificate: React.FC<Props> = () => {
  const { space } = useTheme()
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const [state, setState] = useState<IRequestCertificateData>({
    otherActions: []
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
  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Zertifikate anfordern'
    })
  }, [])

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
            <RequestCertificateData onNext={onNext} onBack={onBack} />
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
