import { Box } from 'native-base'
import { useContext, useState } from 'react'
import PupilPager from '../../widgets/certificates/PupilPager'
import SelectPupilsWidget from '../../widgets/certificates/SelectPupilsWidget'
import { RequestCertificateContext } from '../RequestCertificate'

type Props = {}

const RequestCertificateMatchingWizard: React.FC<Props> = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  return (
    <Box>
      {currentIndex === 0 && (
        <SelectPupilsWidget onNext={() => setCurrentIndex(1)} />
      )}
      {currentIndex === 1 && (
        <PupilPager onFinished={() => setCurrentIndex(2)} />
      )}
    </Box>
  )
}
export default RequestCertificateMatchingWizard
