import { Flex } from 'native-base'
import { useCallback, useContext, useState } from 'react'
import { RequestCertificateContext } from '../../pages/RequestCertificate'
import { LFMatch } from '../../types/lernfair/Match'
import SelectedPupilWizard from './SelectedPupilWizard'

type Props = {
  onFinished: () => any
}

const PupilPager: React.FC<Props> = ({ onFinished }) => {
  const { state } = useContext(RequestCertificateContext)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const next = useCallback(() => {
    if (currentIndex + 1 < state?.pupilMatches.length) {
      setCurrentIndex(prev => prev + 1)
    } else {
      onFinished()
    }
    window.scrollTo({ top: 0 })
  }, [currentIndex, onFinished, state?.pupilMatches.length])

  const prev = useCallback(() => {
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(prev => prev - 1)
      window.scrollTo({ top: 0 })
    }
  }, [currentIndex])

  return (
    <Flex>
      {state?.pupilMatches &&
        state?.pupilMatches.length > 0 &&
        state?.pupilMatches?.map(
          (match: LFMatch, i: number) =>
            i === currentIndex && (
              <SelectedPupilWizard
                match={match}
                onNext={next}
                onPrev={prev}
                pupilCount={state?.pupilMatches.length}
                currentIndex={currentIndex}
              />
            )
        )}
    </Flex>
  )
}
export default PupilPager
