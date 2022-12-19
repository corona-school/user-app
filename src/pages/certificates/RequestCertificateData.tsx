import { useMatomo } from '@jonkoops/matomo-tracker-react'
import { VStack, Heading, useTheme } from 'native-base'
import { useEffect } from 'react'
import RequestCertificateMatchingWizard from './RequestCertificateMatchingWizard'
import RequestCertificateGroupWizard from './RequstCertificateGroupWizard'

type Props = {
  certificateType: 'matching' | 'group'
  onNext: () => any
  onBack: () => any
}

const RequestCertificateData: React.FC<Props> = ({
  onNext,
  onBack,
  certificateType
}) => {
  const { space } = useTheme()

  const { trackPageView } = useMatomo()

  useEffect(() => {
    trackPageView({
      documentTitle: 'Zertifikate anfordern – Formular'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <VStack space={space['1']}>
      <Heading>Informationen eintragen</Heading>

      {(certificateType === 'matching' && (
        <RequestCertificateMatchingWizard onNext={onNext} />
      )) || <RequestCertificateGroupWizard onNext={onNext} />}
    </VStack>
  )
}
export default RequestCertificateData
